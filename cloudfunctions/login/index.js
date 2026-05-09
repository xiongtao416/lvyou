const crypto = require('crypto')

// 云函数入口
exports.main = async (event, context) => {
  const { code, userInfo } = event
  
  if (!code) {
    return {
      code: -1,
      message: '缺少登录凭证'
    }
  }

  try {
    // 调用微信接口获取openid和session_key
    const wxRes = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${context.APPID}&secret=${context.APPSECRET}&js_code=${code}&grant_type=authorization_code`,
      { dataType: 'json' }
    )

    if (wxRes.data.errcode) {
      return {
        code: -1,
        message: `微信登录失败: ${wxRes.data.errmsg}`
      }
    }

    const { openid, session_key, unionid } = wxRes.data

    // 查询用户是否已存在
    const db = uniCloud.database()
    const userCollection = db.collection('users')
    
    let user = await userCollection.where({
      openid: openid
    }).get()

    const now = Date.now()
    let userId
    let isNewUser = false

    if (user.data.length === 0) {
      // 新用户，创建用户记录
      isNewUser = true
      const newUser = {
        openid: openid,
        unionid: unionid || '',
        session_key: session_key,
        avatarUrl: userInfo?.avatarUrl || '',
        nickName: userInfo?.nickName || '',
        createTime: now,
        updateTime: now,
        lastLoginTime: now,
        // 用户信息字段（首次报名时填写）
        realName: '',
        phone: '',
        department: '',
        idCard: '',
        isProfileComplete: false
      }
      
      const addRes = await userCollection.add(newUser)
      userId = addRes.id
    } else {
      // 更新登录信息
      userId = user.data[0]._id
      await userCollection.doc(userId).update({
        session_key: session_key,
        lastLoginTime: now,
        updateTime: now,
        avatarUrl: userInfo?.avatarUrl || user.data[0].avatarUrl,
        nickName: userInfo?.nickName || user.data[0].nickName
      })
    }

    // 生成自定义登录态token
    const token = generateToken(userId, openid)

    return {
      code: 0,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          _id: userId,
          openid: openid,
          avatarUrl: userInfo?.avatarUrl || user.data[0]?.avatarUrl || '',
          nickName: userInfo?.nickName || user.data[0]?.nickName || '',
          isProfileComplete: user.data[0]?.isProfileComplete || false,
          realName: user.data[0]?.realName || ''
        },
        isNewUser
      }
    }
  } catch (error) {
    console.error('登录错误:', error)
    return {
      code: -1,
      message: '登录失败，请重试'
    }
  }
}

// 生成Token
function generateToken(userId, openid) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  const data = `${userId}:${openid}:${timestamp}:${random}`
  return crypto.createHash('sha256').update(data).digest('hex')
}