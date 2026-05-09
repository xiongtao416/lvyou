// 云开发请求封装
const db = uniCloud.database()

// 通用云函数调用
export const callCloudFunction = async (name: string, data: any = {}) => {
  try {
    const { result } = await uniCloud.callFunction({
      name,
      data
    })
    return result
  } catch (error) {
    console.error(`云函数 ${name} 调用失败:`, error)
    throw error
  }
}

// 数据库操作封装
export const dbCollection = (collectionName: string) => {
  return db.collection(collectionName)
}

// 获取当前登录用户
export const getCurrentUser = async () => {
  try {
    const { result } = await uniCloud.callFunction({
      name: 'user',
      data: { action: 'getCurrentUser' }
    })
    return result.data
  } catch (error) {
    return null
  }
}

// 检查登录状态
export const checkLogin = async (): Promise<boolean> => {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo) return false
    
    // 验证token有效性
    const { result } = await uniCloud.callFunction({
      name: 'user',
      data: { action: 'verifyToken' }
    })
    return result.code === 0
  } catch (error) {
    return false
  }
}

// 微信登录
export const wxLogin = async () => {
  try {
    // 获取微信登录凭证
    const [loginErr, loginRes] = await uni.login({
      provider: 'weixin'
    })
    
    if (loginErr) throw loginErr
    
    // 调用云函数完成登录
    const { result } = await uniCloud.callFunction({
      name: 'login',
      data: {
        code: loginRes.code
      }
    })
    
    if (result.code === 0) {
      // 保存登录信息
      uni.setStorageSync('token', result.data.token)
      uni.setStorageSync('userInfo', result.data.userInfo)
      return result.data
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// 获取用户信息
export const getUserProfile = async () => {
  try {
    const [err, res] = await uni.getUserProfile({
      desc: '用于完善用户资料'
    })
    
    if (err) throw err
    
    // 更新用户信息到云数据库
    const { result } = await uniCloud.callFunction({
      name: 'user',
      data: {
        action: 'updateProfile',
        userInfo: res.userInfo
      }
    })
    
    if (result.code === 0) {
      uni.setStorageSync('userInfo', { ...uni.getStorageSync('userInfo'), ...res.userInfo })
    }
    
    return res.userInfo
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}