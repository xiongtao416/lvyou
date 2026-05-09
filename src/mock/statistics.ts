/**
 * 统计相关 Mock 数据
 * 字段名与页面模板保持一致
 */

/** 概览数据 - 字段与 admin/statistics.vue 模板匹配 */
export const mockOverview = {
  activities: 12,
  participants: 386,
  views: 12580,
  revenue: 98560,
  pendingRegistrations: 8
}

/** 活动排行 - 字段与 admin/statistics.vue 模板匹配 */
export const mockActivityRanking = [
  { 
    title: '黄山日出两日游', 
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop', 
    participants: 86, 
    views: 2340, 
    price: 299 
  },
  { 
    title: '武功山高山草甸徒步', 
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop', 
    participants: 72, 
    views: 1890, 
    price: 459 
  },
  { 
    title: '九华山祈福一日游', 
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=100&fit=crop', 
    participants: 65, 
    views: 1560, 
    price: 168 
  }
]

/** 用户统计 - 字段与 admin/statistics.vue 模板匹配 */
export const mockUserStats = {
  total: 1256,
  newToday: 23,
  active: 423
}

/** 趋势数据 */
export const mockTrendData = {
  growth: 18,
  chartData: [65, 78, 90, 85, 95, 110, 125]
}
