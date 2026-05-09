// 日期格式化
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
}

// 获取星期几
export const getWeekDay = (date: string | Date): string => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = new Date(date)
  return weekDays[d.getDay()]
}

// 格式化价格
export const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

// 格式化人数
export const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return String(count)
}

// 相对时间
export const relativeTime = (date: string | Date): string => {
  const now = new Date().getTime()
  const target = new Date(date).getTime()
  const diff = now - target
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  
  if (diff < minute) return '刚刚'
  if (diff < hour) return Math.floor(diff / minute) + '分钟前'
  if (diff < day) return Math.floor(diff / hour) + '小时前'
  if (diff < week) return Math.floor(diff / day) + '天前'
  if (diff < month) return Math.floor(diff / week) + '周前'
  
  return formatDate(date)
}

// 活动状态文本
export const getActivityStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'registering': '报名中',
    'full': '已满员',
    'ongoing': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 活动状态颜色
export const getActivityStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'registering': '#52C41A',
    'full': '#FF6B6B',
    'ongoing': '#4A90D9',
    'completed': '#999999',
    'cancelled': '#999999'
  }
  return colorMap[status] || '#999999'
}