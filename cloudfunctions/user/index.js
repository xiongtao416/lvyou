const db = uniCloud.database()
const usersCollection = db.collection('users')
const registrationsCollection = db.collection('registrations')

exports.main = async (event, context) => {
  const { action } = event
  const { OPENID } = context

  try {
    switch (action) {
      case 'getCurrentUser':
        return await getCurrentUser(OPENID)
      case 'updateProfile':
        return await updateProfile(event, OPENID)
      case 'getMyActivities':
        return await getMyActivities(OPENID, event)
      case 'verifyToken':
        return await verifyToken(OPENID)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('云函数错误:', error)
    return { code: -1, message: error.message }
  }
}

// 获取当前用户
async function getCurrentUser(OPENID) {
  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const userRes = await usersCollection.where({ openid: OPENID }).get()
  
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }

  const user = userRes.data[0]

  // 获取统计信息
  const registrationCount = await registrationsCollection.where({
    userId: user._id
  }).count()

  const upcomingCount = await registrationsCollection.where({
    userId: user._id,
    status: db.command.in(['pending', 'paid', 'confirmed']),
    activityDate: db.command.gte(Date.now())
  }).count()

  return {
    code: 0,
    data: {
      _id: user._id,
      openid: user.openid,
      avatarUrl: user.avatarUrl,
      nickName: user.nickName,
      realName: user.realName,
      phone: user.phone,
      department: user.department,
      idCard: user.idCard,
      isProfileComplete: user.isProfileComplete,
      stats: {
        totalRegistrations: registrationCount.total,
        upcomingActivities: upcomingCount.total
      }
    }
  }
}

// 更新用户资料
async function updateProfile(event, OPENID) {
  const { userInfo } = event

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const userRes = await usersCollection.where({ openid: OPENID }).get()
  
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }

  const userId = userRes.data[0]._id
  const now = Date.now()

  const updateData = {
    updateTime: now
  }

  if (userInfo.avatarUrl) updateData.avatarUrl = userInfo.avatarUrl
  if (userInfo.nickName) updateData.nickName = userInfo.nickName
  if (userInfo.realName) {
    updateData.realName = userInfo.realName
    updateData.isProfileComplete = true
  }
  if (userInfo.phone) updateData.phone = userInfo.phone
  if (userInfo.department) updateData.department = userInfo.department
  if (userInfo.idCard) updateData.idCard = userInfo.idCard

  await usersCollection.doc(userId).update(updateData)

  return {
    code: 0,
    message: '更新成功'
  }
}

// 获取我的活动
async function getMyActivities(OPENID, event) {
  const { type = 'all', page = 1, pageSize = 10 } = event

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const userRes = await usersCollection.where({ openid: OPENID }).get()
  
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }

  const userId = userRes.data[0]._id
  const now = Date.now()

  let whereCondition = { userId: userId }

  // 根据类型筛选
  if (type === 'upcoming') {
    // 即将参加
    whereCondition.status = db.command.in(['pending', 'paid', 'confirmed'])
    whereCondition.activityDate = db.command.gte(now)
  } else if (type === 'ongoing') {
    // 进行中
    whereCondition.status = db.command.in(['paid', 'confirmed'])
    whereCondition.activityDate = db.command.lte(now)
    whereCondition['activity.endDate'] = db.command.gte(now)
  } else if (type === 'completed') {
    // 已完成
    whereCondition.status = db.command.in(['confirmed', 'cancelled'])
    whereCondition['activity.endDate'] = db.command.lt(now)
  }

  const listRes = await registrationsCollection
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  const countRes = await registrationsCollection.where(whereCondition).count()

  return {
    code: 0,
    data: {
      list: listRes.data,
      total: countRes.total,
      hasMore: countRes.total > page * pageSize
    }
  }
}

// 验证Token
async function verifyToken(OPENID) {
  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const userRes = await usersCollection.where({ openid: OPENID }).get()
  
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }

  return { code: 0, message: 'Token有效' }
}
