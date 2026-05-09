// 活动相关云函数
const db = uniCloud.database()
const activitiesCollection = db.collection('activities')
const registrationsCollection = db.collection('registrations')

exports.main = async (event, context) => {
  const { action } = event
  
  try {
    switch (action) {
      case 'getHomeData':
        return await getHomeData(event)
      case 'getActivityDetail':
        return await getActivityDetail(event)
      case 'getActivityList':
        return await getActivityList(event)
      case 'createActivity':
        return await createActivity(event, context)
      case 'updateActivity':
        return await updateActivity(event, context)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('云函数错误:', error)
    return { code: -1, message: error.message }
  }
}

// 获取首页数据
async function getHomeData(event) {
  const { type = 'nearby', category = 'all' } = event
  const now = Date.now()
  
  // 构建查询条件
  let whereCondition = {}
  
  // 活动类型筛选（周边/远行）
  if (type) {
    whereCondition.type = type
  }
  
  // 分类筛选
  if (category && category !== 'all') {
    whereCondition.category = category
  }
  
  // 获取当前进行中的活动
  const currentActivitiesRes = await activitiesCollection
    .where({
      ...whereCondition,
      status: 'registering',
      startDate: db.command.gte(now)
    })
    .orderBy('startDate', 'asc')
    .limit(10)
    .get()
  
  // 获取已结束的活动（用于历历在目）
  const pastActivitiesRes = await activitiesCollection
    .where({
      ...whereCondition,
      status: db.command.in(['completed', 'ongoing']),
      endDate: db.command.lt(now)
    })
    .orderBy('endDate', 'desc')
    .limit(4)
    .get()
  
  // 获取精选游记
  const featuredNoteRes = await db.collection('notes')
    .where({
      isFeatured: true,
      status: 'published'
    })
    .orderBy('createTime', 'desc')
    .limit(1)
    .get()
  
  // 处理当前活动数据，添加参与者信息
  const currentActivities = await Promise.all(
    currentActivitiesRes.data.map(async (activity) => {
      const participantsRes = await registrationsCollection
        .where({
          activityId: activity._id,
          status: db.command.in(['paid', 'confirmed'])
        })
        .limit(3)
        .get()
      
      return {
        ...activity,
        participantCount: await getParticipantCount(activity._id),
        participants: participantsRes.data.map(r => ({
          avatar: r.userAvatar,
          name: r.userName
        }))
      }
    })
  )
  
  return {
    code: 0,
    data: {
      currentActivities,
      pastActivities: pastActivitiesRes.data.map(item => ({
        ...item,
        coverImage: item.images?.[0] || '',
        noteId: item.noteId || ''
      })),
      featuredNote: featuredNoteRes.data[0] || null
    }
  }
}

// 获取活动详情
async function getActivityDetail(event) {
  const { id } = event
  
  if (!id) {
    return { code: -1, message: '缺少活动ID' }
  }
  
  const activityRes = await activitiesCollection.doc(id).get()
  
  if (activityRes.data.length === 0) {
    return { code: -1, message: '活动不存在' }
  }
  
  const activity = activityRes.data[0]
  
  // 获取参与者列表
  const participantsRes = await registrationsCollection
    .where({
      activityId: id,
      status: db.command.in(['paid', 'confirmed'])
    })
    .orderBy('createTime', 'desc')
    .limit(20)
    .get()
  
  // 获取组织者信息
  const organizerRes = await db.collection('users').doc(activity.organizerId).get()
  
  return {
    code: 0,
    data: {
      ...activity,
      participantCount: await getParticipantCount(id),
      participants: participantsRes.data.map(r => ({
        avatar: r.userAvatar,
        name: r.userName,
        userId: r.userId
      })),
      organizer: organizerRes.data[0] || null
    }
  }
}

// 获取活动列表
async function getActivityList(event) {
  const { type = 'current', page = 1, pageSize = 10, category } = event
  const now = Date.now()
  
  let whereCondition = {}
  
  if (type === 'current') {
    whereCondition = {
      status: 'registering',
      startDate: db.command.gte(now)
    }
  } else if (type === 'past') {
    whereCondition = {
      status: db.command.in(['completed', 'ongoing'])
    }
  }
  
  if (category && category !== 'all') {
    whereCondition.category = category
  }
  
  const listRes = await activitiesCollection
    .where(whereCondition)
    .orderBy('startDate', type === 'current' ? 'asc' : 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  // 获取总数
  const countRes = await activitiesCollection.where(whereCondition).count()
  
  return {
    code: 0,
    data: {
      list: listRes.data,
      total: countRes.total,
      hasMore: countRes.total > page * pageSize
    }
  }
}

// 创建活动
async function createActivity(event, context) {
  const { activityData } = event
  const { OPENID } = context
  
  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }
  
  // 获取用户信息
  const userRes = await db.collection('users').where({ openid: OPENID }).get()
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }
  
  const user = userRes.data[0]
  
  const newActivity = {
    ...activityData,
    organizerId: user._id,
    organizerName: user.nickName || user.realName,
    organizerAvatar: user.avatarUrl,
    status: 'registering',
    createTime: Date.now(),
    updateTime: Date.now(),
    participantCount: 0,
    viewCount: 0
  }
  
  const addRes = await activitiesCollection.add(newActivity)
  
  return {
    code: 0,
    data: {
      _id: addRes.id,
      ...newActivity
    }
  }
}

// 更新活动
async function updateActivity(event, context) {
  const { id, updateData } = event
  const { OPENID } = context
  
  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }
  
  // 验证权限
  const activityRes = await activitiesCollection.doc(id).get()
  if (activityRes.data.length === 0) {
    return { code: -1, message: '活动不存在' }
  }
  
  const userRes = await db.collection('users').where({ openid: OPENID }).get()
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }
  
  const activity = activityRes.data[0]
  const user = userRes.data[0]
  
  // 只有组织者可以修改
  if (activity.organizerId !== user._id) {
    return { code: -1, message: '无权修改此活动' }
  }
  
  await activitiesCollection.doc(id).update({
    ...updateData,
    updateTime: Date.now()
  })
  
  return { code: 0, message: '更新成功' }
}

// 获取参与者数量
async function getParticipantCount(activityId) {
  const countRes = await registrationsCollection.where({
    activityId: activityId,
    status: db.command.in(['paid', 'confirmed'])
  }).count()
  
  return countRes.total
}