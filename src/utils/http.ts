/**
 * HTTP API 请求封装
 * 用于本地开发调用 Express 后端
 * 后期部署到 uniCloud 时可切换为云开发模式
 */

// API 基础地址
// H5开发时使用相对路径（vite代理），小程序/生产环境使用完整URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 请求超时时间
const TIMEOUT = 15000

// 是否为开发环境
const isDev = import.meta.env.DEV

// Toast 防抖：避免多个错误 Toast 重叠
let toastTimer: any = null
const showToast = (title: string) => {
  if (toastTimer) return
  toastTimer = setTimeout(() => { toastTimer = null }, 2000)
  uni.showToast({ title, icon: 'none', duration: 2000 })
}

// 请求拦截
const request = (options: any) => {
  return new Promise((resolve, reject) => {
    // GET 请求：将 params 拼接到 URL 上
    let requestUrl = BASE_URL + options.url
    if (options.method === 'GET' && options.data) {
      const query = Object.entries(options.data)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
      if (query) requestUrl += '?' + query
    }

    // 自动注入 Token
    const token = uni.getStorageSync('auth_token')
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.header
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // 开发环境打印请求日志
    if (isDev) {
      console.log(`[API] ${options.method || 'GET'} ${requestUrl}`, options.method === 'GET' ? '' : options.data)
    }

    uni.request({
      url: requestUrl,
      method: options.method || 'GET',
      data: options.method === 'GET' ? undefined : options.data,
      header: headers,
      timeout: options.timeout || TIMEOUT,
      success: (res: any) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            if (isDev) {
              console.log(`[API] ✅ ${options.method || 'GET'} ${requestUrl}`)
            }
            resolve(res.data.data)
          } else if (res.data.code === 401) {
            // 未授权，跳转登录
            showToast('请先登录')
            setTimeout(() => {
              uni.navigateTo({ url: '/pages/login/index' })
            }, 1500)
            reject(res.data)
          } else {
            showToast(res.data.message || '请求失败')
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          showToast('请先登录')
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/index' })
          }, 1500)
          reject(res)
        } else if (res.statusCode === 403) {
          showToast('无权限访问')
          reject(res)
        } else if (res.statusCode >= 500) {
          showToast('服务器异常，请稍后重试')
          if (isDev) console.error(`[API] ❌ Server Error ${res.statusCode}:`, requestUrl)
          reject(res)
        } else {
          showToast('请求失败')
          reject(res)
        }
      },
      fail: (err: any) => {
        showToast('网络连接失败')
        if (isDev) console.error('[API] ❌ Network Error:', requestUrl, err)
        reject(err)
      }
    })
  })
}

// GET 请求
export const get = (url: string, params?: any) => {
  return request({ url, method: 'GET', data: params })
}

// POST 请求
export const post = (url: string, data?: any) => {
  return request({ url, method: 'POST', data })
}

// PUT 请求
export const put = (url: string, data?: any) => {
  return request({ url, method: 'PUT', data })
}

// DELETE 请求
export const del = (url: string) => {
  return request({ url, method: 'DELETE' })
}

// ==================== 活动 API ====================
export const activityApi = {
  getList: (params?: any) => get('/activities', params),
  getById: (id: string) => get(`/activities/${id}`),
  getHot: () => get('/activities/hot'),
  getPast: () => get('/activities/past'),
  create: (data: any) => post('/activities', data),
  update: (id: string, data: any) => put(`/activities/${id}`, data),
  remove: (id: string) => del(`/activities/${id}`)
}

// ==================== 报名 API ====================
export const registrationApi = {
  getList: (params?: any) => get('/registrations', params),
  create: (data: any) => post('/registrations', data),
  review: (id: string, status: string) => put(`/registrations/${id}/review`, { status }),
  getMyRegistrations: (userId: string) => get('/registrations/my', { userId })
}

// ==================== 用户 API ====================
export const userApi = {
  getById: (id: string) => get(`/users/${id}`),
  update: (id: string, data: any) => put(`/users/${id}`, data),
  getList: (params?: any) => get('/users', params),
  getAdminList: () => get('/users/admins')
}

// ==================== 游记 API ====================
export const noteApi = {
  getList: (params?: any) => get('/notes', params),
  getById: (id: string) => get(`/notes/${id}`),
  create: (data: any) => post('/notes', data),
  review: (id: string, status: string) => put(`/notes/${id}/review`, { status })
}

// ==================== 统计 API ====================
export const statisticsApi = {
  getOverview: () => get('/statistics/overview'),
  getUserStats: () => get('/statistics/user-stats'),
  getActivityRanking: () => get('/statistics/activity-ranking')
}

// ==================== 首页 API ====================
export const homeApi = {
  getBanners: () => get('/home/banners'),
  getNavItems: () => get('/home/nav-items'),
  getHomeData: () => get('/home/home-data')
}

export default request
