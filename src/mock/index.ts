/**
 * Mock 数据统一导出
 * 
 * 使用说明:
 * 1. 阶段1: 直接导入使用 Mock 数据
 * 2. 阶段2: 修改为 API 调用，保持接口不变
 * 3. 阶段3: 后端连接数据库
 * 
 * 示例:
 * ```typescript
 * import { getActivityById, mockActivityList } from '@/mock'
 * 
 * // 阶段1: 使用 Mock
 * const activity = getActivityById('1')
 * 
 * // 阶段2/3: 替换为 API 调用
 * const activity = await api.getActivityById('1')
 * ```
 */

// 活动相关
export {
  mockActivityData,
  mockTimelineItems,
  mockActivityList,
  getActivityById,
  getActivityList
} from './activity'

// 用户相关
export {
  mockUserInfo,
  mockIncompleteUserInfo,
  mockAdminList
} from './user'

// 首页相关
export {
  mockBanners,
  mockNavItems,
  mockHotActivities,
  mockPastActivities
} from './home'

// 报名相关
export {
  mockRegistrations,
  mockMyActivities,
  mockAdminActivities
} from './registration'

// 统计相关
export {
  mockOverview,
  mockActivityRanking,
  mockUserStats,
  mockTrendData
} from './statistics'

// 游记相关
export {
  mockNoteData,
  mockNoteList
} from './note'
