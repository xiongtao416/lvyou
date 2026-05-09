/**
 * 报名相关 Mock 数据
 * 字段名与页面模板保持一致
 */

/** 报名列表 - 与 admin/registrations.vue 模板匹配 */
export const mockRegistrations = [
  {
    _id: '1',
    activityId: '1',
    activityTitle: '黄山日出两日游',
    name: '张三',
    phone: '138****1234',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    department: '计算机学院',
    count: 2,
    totalPrice: 598,
    status: 'confirmed',
    statusText: '已通过',
    registerTime: '2026-04-20 10:30',
    remark: '带小孩，需要安排亲子房'
  },
  {
    _id: '2',
    activityId: '1',
    activityTitle: '黄山日出两日游',
    name: '李四',
    phone: '139****5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    department: '文学院',
    count: 1,
    totalPrice: 299,
    status: 'pending',
    statusText: '待审核',
    registerTime: '2026-04-21 14:20',
    remark: ''
  },
  {
    _id: '3',
    activityId: '2',
    activityTitle: '武功山高山草甸徒步',
    name: '王五',
    phone: '137****9012',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    department: '体育学院',
    count: 3,
    totalPrice: 1377,
    status: 'cancelled',
    statusText: '已取消',
    registerTime: '2026-04-19 09:00',
    remark: '临时有事无法参加'
  }
]

/** 我的活动列表 - 与 profile/index.vue 模板匹配 */
export const mockMyActivities = [
  { 
    _id: '1', 
    title: '黄山日出两日游｜观云海赏奇松', 
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    date: '2026-05-15',
    location: '黄山风景区',
    status: 'upcoming',
    statusText: '即将开始',
    statusClass: 'upcoming',
    price: 299
  },
  { 
    _id: '2', 
    title: '武功山高山草甸徒步', 
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    date: '2026-04-20',
    location: '江西萍乡武功山',
    status: 'completed',
    statusText: '已结束',
    statusClass: 'completed',
    price: 459
  },
  { 
    _id: '3', 
    title: '千岛湖环湖骑行', 
    coverImage: 'https://images.unsplash.com/photo-1544191696-102a3c7438d8?w=400&h=300&fit=crop',
    date: '2026-03-15',
    location: '浙江千岛湖',
    status: 'cancelled',
    statusText: '已取消',
    statusClass: 'cancelled',
    price: 168
  }
]

/** 管理员活动列表（简化版） */
export const mockAdminActivities = [
  { _id: '1', title: '黄山日出两日游', registrationCount: 18 },
  { _id: '2', title: '武功山高山草甸徒步', registrationCount: 25 },
  { _id: '3', title: '九华山祈福一日游', registrationCount: 32 }
]
