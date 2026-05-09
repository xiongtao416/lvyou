const db = uniCloud.database()
const registrationsCollection = db.collection('registrations')
const activitiesCollection = db.collection('activities')
const usersCollection = db.collection('users')

exports.main = async (event, context) => {
  const { action } = event
  const { OPENID } = context

  try {
    switch (action) {
      case 'create':
        return await createRegistration(event, OPENID)
      case 'getMyRegistrations':
        return await getMyRegistrations(OPENID, event)
      case 'cancel':
        return await cancelRegistration(event, OPENID)
      case 'getRegistrationDetail':
        return await getRegistrationDetail(event, OPENID)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('云函数错误:', error)
    return { code: -1, message: error.message }
  }
}

// 创建报名
async function createRegistration(event, OPENID) {
  const { activityId, formData, totalPrice } = event

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  // 获取用户信息
  const userRes = await usersCollection.where({ openid: OPENID }).get()
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }
  const user = userRes.data[0]

  // 检查活动是否存在且可报名
  const activityRes = await activitiesCollection.doc(activityId).get()
  if (activityRes.data.length === 0) {
    return { code: -1, message: '活动不存在' }
  }
  const activity = activityRes.data[0]

  if (activity.status !== 'registering') {
    return { code: -1, message: '活动不可报名' }
  }

  // 检查是否已报名
  const existingRes = await registrationsCollection.where({
    activityId: activityId,
    userId: user._id,
    status: db.command.in(['pending', 'paid', 'confirmed'])
  }).get()

  if (existingRes.data.length > 0) {
    return { code: -1, message: '您已报名该活动' }
  }

  // 检查名额
  const countRes = await registrationsCollection.where({
    activityId: activityId,
    status: db.command.in(['paid', 'confirmed'])
  }).count()

  if (countRes.total + formData.count > activity.maxParticipants) {
    return { code: -1, message: '名额不足' }
  }

  const now = Date.now()

  // 创建报名记录
  const registrationData = {
    activityId: activityId,
    userId: user._id,
    userOpenid: OPENID,
    userName: formData.realName,
    userAvatar: user.avatarUrl,
    userNickName: user.nickName,
    
    // 报名信息
    realName: formData.realName,
    phone: formData.phone,
    department: formData.department,
    idCard: formData.idCard,
    count: formData.count,
    transport: formData.transport,
    remark: formData.remark,
    
    // 费用信息
    pricePerPerson: activity.price,
    totalPrice: totalPrice,
    
    // 状态
    status: 'pending', // pending: 待支付, paid: 已支付, confirmed: 已确认, cancelled: 已取消, refunded: 已退款
    
    // 活动信息（冗余存储，方便查询）
    activityTitle: activity.title,
    activityDate: activity.startDate,
    activityLocation: activity.location,
    
    createTime: now,
    updateTime: now
  }

  const addRes = await registrationsCollection.add(registrationData)

  // 更新用户信息（如果首次填写）
  if (!user.isProfileComplete) {
    await usersCollection.doc(user._id).update({
      realName: formData.realName,
      phone: formData.phone,
      department: formData.department,
      idCard: formData.idCard,
      isProfileComplete: true,
      updateTime: now
    })
  }

  // 如果费用为0，直接确认
  if (totalPrice === 0) {
    await registrationsCollection.doc(addRes.id).update({
      status: 'confirmed',
      updateTime: now
    })
    
    // 更新活动参与人数
    await updateActivityParticipantCount(activityId)
    
    return {
      code: 0,
      message: '报名成功',
      data: {
        registrationId: addRes.id,
        needPayment: false
      }
    }
  }

  // 需要支付，生成支付参数
  // 这里简化处理，实际应该调用微信支付统一下单接口
  const paymentParams = {
    timeStamp: String(now),
    nonceStr: generateNonceStr(),
    package: 'prepay_id=xxx', // 实际应从微信支付获取
    signType: 'MD5',
    paySign: 'xxx' // 实际应生成签名
  }

  return {
    code: 0,
    message: '请完成支付',
    data: {
      registrationId: addRes.id,
      needPayment: true,
      paymentParams
    }
  }
}

// 获取我的报名列表
async function getMyRegistrations(OPENID, event) {
  const { status, page = 1, pageSize = 10 } = event

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const userRes = await usersCollection.where({ openid: OPENID }).get()
  if (userRes.data.length === 0) {
    return { code: -1, message: '用户不存在' }
  }
  const user = userRes.data[0]

  let whereCondition = { userId: user._id }
  if (status) {
    whereCondition.status = status
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

// 取消报名
async function cancelRegistration(event, OPENID) {
  const { registrationId } = event

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const registrationRes = await registrationsCollection.doc(registrationId).get()
  if (registrationRes.data.length === 0) {
    return { code: -1, message: '报名记录不存在' }
  }

  const registration = registrationRes.data[0]

  // 验证权限
  const userRes = await usersCollection.where({ openid: OPENID }).get()
  if (userRes.data.length === 0 || userRes.data[0]._id !== registration.userId) {
    return { code: -1, message: '无权操作' }
  }

  // 检查状态
  if (registration.status === 'cancelled') {
    return { code: -1, message: '报名已取消' }
  }

  if (registration.status === 'confirmed') {
    // 已确认的报名，检查是否在可退款时间内
    const activityRes = await activitiesCollection.doc(registration.activityId).get()
    const activity = activityRes.data[0]
    const now = Date.now()
    
    // 假设活动前3天可退款
    const refundDeadline = activity.startDate - 3 * 24 * 60 * 60 * 1000
    if (now > refundDeadline) {
      return { code: -1, message: '已超过退款时间' }
    }
  }

  // 更新报名状态
  await registrationsCollection.doc(registrationId).update({
    status: 'cancelled',
    cancelTime: Date.now(),
    updateTime: Date.now()
  })

  // 更新活动参与人数
  await updateActivityParticipantCount(registration.activityId)

  return { code: 0, message: '取消成功' }
}

// 获取报名详情
async function getRegistrationDetail(event, OPENID) {
  const { registrationId } = event

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  const registrationRes = await registrationsCollection.doc(registrationId).get()
  if (registrationRes.data.length === 0) {
    return { code: -1, message: '报名记录不存在' }
  }

  const registration = registrationRes.data[0]

  // 验证权限
  const userRes = await usersCollection.where({ openid: OPENID }).get()
  if (userRes.data.length === 0 || userRes.data[0]._id !== registration.userId) {
    return { code: -1, message: '无权查看' }
  }

  // 获取活动详情
  const activityRes = await activitiesCollection.doc(registration.activityId).get()

  return {
    code: 0,
    data: {
      ...registration,
      activity: activityRes.data[0] || null
    }
  }
}

// 更新活动参与人数
async function updateActivityParticipantCount(activityId) {
  const countRes = await registrationsCollection.where({
    activityId: activityId,
    status: db.command.in(['paid', 'confirmed'])
  }).count()

  await activitiesCollection.doc(activityId).update({
    participantCount: countRes.total,
    updateTime: Date.now()
  })
}

// 生成随机字符串
function generateNonceStr() {
  return Math.random().toString(36).substring(2, 15)
}