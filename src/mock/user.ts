/**
 * 用户相关 Mock 数据
 * 字段名与页面模板保持一致
 */

/** 用户信息 - 与 profile/index.vue 模板匹配 */
export const mockUserInfo = {
  name: '张老师',
  department: '计算机学院',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  phone: '138****8888',
  stats: {
    joinCount: 12,
    upcomingCount: 2,
    noteCount: 5
  }
}

/** 未完善资料的用户 - 与 register.vue 模板匹配 */
export const mockIncompleteUserInfo = {
  isProfileComplete: false,
  realName: '',
  phone: '',
  department: '',
  idCard: ''
}

/** 管理员列表 - 与 admin/users.vue 模板匹配 */
export const mockAdminList = [
  { 
    name: '张老师', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 
    role: '超级管理员',
    status: 'online'
  },
  { 
    name: '李老师', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', 
    role: '管理员',
    status: 'offline'
  }
]
