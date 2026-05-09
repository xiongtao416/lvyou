/**
 * 项目常量定义
 * 统一管理所有魔法数字和硬编码字符串
 */

// ==================== 时间常量 ====================

/** Toast显示时长（毫秒） */
export const TOAST_DURATION_SHORT = 1500
export const TOAST_DURATION_LONG = 3000

/** 动画延迟时长（毫秒） */
export const ANIMATION_DELAY = 300
export const ANIMATION_DURATION = 200

/** 防抖延迟（毫秒） */
export const DEBOUNCE_DELAY = 300

/** 节流延迟（毫秒） */
export const THROTTLE_DELAY = 1000

// ==================== 分页常量 ====================

/** 默认每页数量 */
export const PAGE_SIZE = 20

/** 列表初始加载数量 */
export const LIST_INIT_SIZE = 10

// ==================== 状态栏高度 ====================

/** 默认状态栏高度 */
export const DEFAULT_STATUS_BAR_HEIGHT = 44

// ==================== 活动状态 ====================

export const ACTIVITY_STATUS = {
  REGISTERING: 'registering',      // 报名中
  FULL: 'full',                    // 已满员
  ONGOING: 'ongoing',              // 进行中
  COMPLETED: 'completed',           // 已结束
  DRAFT: 'draft',                  // 草稿
  SCHEDULED: 'scheduled'           // 预约发布
} as const

export type ActivityStatus = typeof ACTIVITY_STATUS[keyof typeof ACTIVITY_STATUS]

/** 状态显示文本 */
export const ACTIVITY_STATUS_TEXT: Record<ActivityStatus, string> = {
  [ACTIVITY_STATUS.REGISTERING]: '报名中',
  [ACTIVITY_STATUS.FULL]: '已满员',
  [ACTIVITY_STATUS.ONGOING]: '进行中',
  [ACTIVITY_STATUS.COMPLETED]: '已结束',
  [ACTIVITY_STATUS.DRAFT]: '草稿',
  [ACTIVITY_STATUS.SCHEDULED]: '待发布'
}

/** 状态样式类名 */
export const ACTIVITY_STATUS_CLASS: Record<ActivityStatus, string> = {
  [ACTIVITY_STATUS.REGISTERING]: 'registering',
  [ACTIVITY_STATUS.FULL]: 'full',
  [ACTIVITY_STATUS.ONGOING]: 'ongoing',
  [ACTIVITY_STATUS.COMPLETED]: 'completed',
  [ACTIVITY_STATUS.DRAFT]: 'draft',
  [ACTIVITY_STATUS.SCHEDULED]: 'scheduled'
}

// ==================== 报名状态 ====================

export const REGISTRATION_STATUS = {
  PENDING: 'pending',              // 待审核
  CONFIRMED: 'confirmed',           // 已通过
  CANCELLED: 'cancelled',          // 已取消
  REFUNDED: 'refunded'             // 已退款
} as const

export type RegistrationStatus = typeof REGISTRATION_STATUS[keyof typeof REGISTRATION_STATUS]

/** 报名状态显示文本 */
export const REGISTRATION_STATUS_TEXT: Record<RegistrationStatus, string> = {
  [REGISTRATION_STATUS.PENDING]: '待审核',
  [REGISTRATION_STATUS.CONFIRMED]: '已通过',
  [REGISTRATION_STATUS.CANCELLED]: '已取消',
  [REGISTRATION_STATUS.REFUNDED]: '已退款'
}

// ==================== 页面路径 ====================

export const PAGE_PATH = {
  HOME: '/pages/index/index',
  ACTIVITY_DETAIL: '/pages/activity/detail',
  ACTIVITY_REGISTER: '/pages/activity/register',
  ACTIVITY_LIST: '/pages/activity/list',
  PROFILE: '/pages/profile/index',
  LOGIN: '/pages/login/index',
  AGREEMENT: '/pages/agreement/index',
  ADMIN_INDEX: '/pages/admin/index',
  ADMIN_PUBLISH: '/pages/admin/publish',
  ADMIN_REGISTRATIONS: '/pages/admin/registrations',
  ADMIN_STATISTICS: '/pages/admin/statistics',
  ADMIN_CONTENT: '/pages/admin/content',
  ADMIN_USERS: '/pages/admin/users'
} as const

// ==================== 存储Key ====================

export const STORAGE_KEY = {
  USER_INFO: 'user_info',
  TOKEN: 'auth_token',
  FAVORITES: 'favorite_activities',
  SEARCH_HISTORY: 'search_history',
  SETTINGS: 'app_settings'
} as const

// ==================== API配置 ====================

export const API_CONFIG = {
  TIMEOUT: 10000,                  // 请求超时（毫秒）
  RETRY_TIMES: 3,                 // 重试次数
  BASE_URL: ''                     // API基础URL（根据环境配置）
} as const

// ==================== 验证规则 ====================

export const VALIDATION_RULES = {
  PHONE_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20,
  NICKNAME_MAX_LENGTH: 20,
  ACTIVITY_TITLE_MAX_LENGTH: 50,
  ACTIVITY_DESC_MAX_LENGTH: 500
} as const

// ==================== 枚举映射 ====================

/** 性别枚举 */
export const GENDER = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2
} as const

/** 性别文本 */
export const GENDER_TEXT: Record<number, string> = {
  [GENDER.UNKNOWN]: '未知',
  [GENDER.MALE]: '男',
  [GENDER.FEMALE]: '女'
}

/** 角色枚举 */
export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const
