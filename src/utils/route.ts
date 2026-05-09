/**
 * 路由工具函数
 * 统一处理跨平台路由参数获取
 */

/**
 * 获取页面路由参数
 * 兼容小程序、H5、App各平台
 * @param key 参数名
 * @returns 参数值
 */
export const getRouteParam = (key: string): string => {
  let value = ''
  
  try {
    // 小程序/App环境
    // #ifdef MP-WEIXIN || MP-ALIPAY || APP-PLUS
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    value = currentPage.options?.[key] || currentPage.$page?.options?.[key] || ''
    // #endif
    
    // H5环境
    // #ifdef H5
    const hash = window.location.hash
    const search = window.location.search
    const url = hash || search
    const match = url.match(new RegExp(`${key}=([^&]*)`))
    if (match) value = decodeURIComponent(match[1])
    // #endif
  } catch (e) {
    console.error('获取路由参数失败:', e)
  }
  
  return value
}

/**
 * 获取所有路由参数
 * @returns 参数对象
 */
export const getRouteParams = (): Record<string, string> => {
  const params: Record<string, string> = {}
  
  try {
    // #ifdef MP-WEIXIN || MP-ALIPAY || APP-PLUS
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    Object.assign(params, currentPage.options || currentPage.$page?.options || {})
    // #endif
    
    // #ifdef H5
    const hash = window.location.hash
    const search = window.location.search
    const queryString = hash.split('?')[1] || search.slice(1)
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=')
        if (key) params[key] = decodeURIComponent(value || '')
      })
    }
    // #endif
  } catch (e) {
    console.error('获取路由参数失败:', e)
  }
  
  return params
}
