/**
 * 项目TypeScript类型定义
 * 统一管理所有接口和类型
 */

// ==================== 活动相关 ====================

/** 活动基本信息 */
export interface Activity {
  id: string
  title: string
  cover: string
  date: string
  location: string
  participants: number
  views: number
  price: number
  maxParticipants: number
  description: string
  status: ActivityStatus
  statusText: string
  statusClass: string
  coverImages?: string[]
  itinerary?: ItineraryDay[]
  highlights?: string[]
  tips?: string[]
  scheduledDate?: string
  saveTime?: string
}

/** 活动状态 */
export type ActivityStatus = 'registering' | 'full' | 'ongoing' | 'completed' | 'draft' | 'scheduled'

/** 行程安排-天 */
export interface ItineraryDay {
  title: string
  date: string
  items: ItineraryItem[]
}

/** 行程安排-项 */
export interface ItineraryItem {
  time: string
  title: string
  description: string
  image?: string
  tags?: string[]
  isHighlight?: boolean
}

/** 时间轴项 */
export interface TimelineItem {
  timeRange: string
  title: string
  desc?: string
  image?: string
  tags?: string[]
  isHighlight?: boolean
}

/** 活动搜索筛选 */
export interface ActivityFilter {
  keyword?: string
  date?: string
  location?: string
  status?: ActivityStatus
  minPrice?: number
  maxPrice?: number
}

// ==================== 用户相关 ====================

/** 用户信息 */
export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  gender: number
  role: UserRole
  createdAt: string
}

/** 用户角色 */
export type UserRole = 'user' | 'admin' | 'super_admin'

/** 登录参数 */
export interface LoginParams {
  phone: string
  password: string
}

/** 登录结果 */
export interface LoginResult {
  token: string
  userInfo: UserInfo
}

// ==================== 报名相关 ====================

/** 报名信息 */
export interface Registration {
  id: string
  activityId: string
  activityTitle: string
  userId: string
  userName: string
  userPhone: string
  userCount: number
  totalPrice: number
  status: RegistrationStatus
  statusText: string
  createTime: string
  remark?: string
}

/** 报名状态 */
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'

/** 报名参数 */
export interface RegisterParams {
  activityId: string
  userName: string
  userPhone: string
  userCount: number
  remark?: string
}

// ==================== 游记/内容相关 ====================

/** 游记信息 */
export interface Note {
  id: string
  title: string
  content: string
  images: string[]
  authorId: string
  authorName: string
  authorAvatar: string
  activityId?: string
  activityTitle?: string
  likes: number
  views: number
  status: NoteStatus
  statusText: string
  createTime: string
}

/** 游记状态 */
export type NoteStatus = 'pending' | 'approved' | 'rejected'

/** 评论信息 */
export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar: string
  targetId: string
  targetType: 'note' | 'activity'
  likes: number
  createTime: string
}

// ==================== 管理统计相关 ====================

/** 统计数据 */
export interface Statistics {
  totalActivities: number
  totalParticipants: number
  totalRevenue: number
  pendingRegistrations: number
  activeUsers: number
  pendingNotes: number
}

/** 管理员操作日志 */
export interface AdminLog {
  id: string
  action: string
  targetType: string
  targetId: string
  adminId: string
  adminName: string
  createTime: string
  detail?: string
}

// ==================== 通用类型 ====================

/** 分页参数 */
export interface PageParams {
  page: number
  pageSize: number
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** API响应格式 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/** Tab项 */
export interface TabItem {
  label: string
  badge?: number
  value?: string
}

// ==================== 表单相关 ====================

/** 编辑表单数据 */
export interface ActivityEditForm {
  id: string
  title: string
  date: string
  location: string
  price: string
  maxParticipants: string
  description: string
  cover?: string
}
