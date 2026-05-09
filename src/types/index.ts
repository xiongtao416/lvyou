/**
 * 项目TypeScript类型定义
 * 统一管理所有接口和类型
 * 字段名与Mock数据和页面模板保持一致
 */

// ==================== 活动相关 ====================

/** 活动详情（detail页使用） */
export interface Activity {
  _id: string
  images: string[]
  tags: string[]
  title: string
  startDate: string
  location: string
  price: number
  organizer: { avatarUrl: string; nickName: string }
  meetingPoint: string
  participantCount: number
  participants: { avatar: string; name: string }[]
  description: string
  itinerary: ItineraryDay[]
  feeInclude: string[]
  feeExclude: string[]
  notices: { title: string; content: string }[]
}

/** 活动状态 */
export type ActivityStatus = 'registering' | 'full' | 'ongoing' | 'completed' | 'draft' | 'scheduled'

/** 行程安排-天（与mock数据结构一致） */
export interface ItineraryDay {
  title: string
  expanded: boolean
  schedule: { time: string; content: string }[]
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

/** 活动列表项（首页卡片使用） */
export interface ActivityCard {
  _id: string
  title: string
  image: string
  typeTag: string
  location: string
  date: string
  price: number
  participantCount: number
  participants: string[]
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
  _id: string
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

/** 统计概览 */
export interface StatisticsOverview {
  activities: number
  participants: number
  views: number
  revenue: number
  pendingRegistrations: number
}

/** 用户统计 */
export interface UserStats {
  total: number
  newToday: number
  active: number
}

/** 活动排行 */
export interface ActivityRanking {
  title: string
  cover: string
  participants: number
  views: number
  price: number
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

// ==================== 首页相关 ====================

/** 轮播图 */
export interface Banner {
  id: string
  image: string
  title: string
  subtitle: string
  badge?: string
}

/** 金刚区导航项 */
export interface NavItem {
  label: string
  icon: string
  bgColor: string
  category: string
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
