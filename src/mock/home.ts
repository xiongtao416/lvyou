/**
 * 首页相关 Mock 数据
 * 字段名与页面模板保持一致
 */

import type { Banner, NavItem } from '@/types'

/**
 * 轮播图数据
 */
export const mockBanners: Banner[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop',
    title: '黄山日出两日游',
    subtitle: '观云海赏奇松，登顶光明顶',
    badge: '热门'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=400&fit=crop',
    title: '星空露营之夜',
    subtitle: '篝火晚会，仰望银河',
    badge: '推荐'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
    title: '武功山徒步',
    subtitle: '高山草甸，云海日出',
    badge: ''
  }
]

/**
 * 金刚区导航
 */
export const mockNavItems: NavItem[] = [
  { label: '徒步登山', icon: '徒', bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'hiking' },
  { label: '露营野炊', icon: '营', bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'camping' },
  { label: '骑行探索', icon: '骑', bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', category: 'cycling' },
  { label: '水上运动', icon: '水', bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', category: 'water' },
  { label: '亲子活动', icon: '亲', bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', category: 'family' },
  { label: '摄影旅拍', icon: '摄', bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', category: 'photo' },
  { label: '极限挑战', icon: '极', bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', category: 'extreme' },
  { label: '周末短途', icon: '短', bgColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', category: 'weekend' }
]

/**
 * 热门活动 - 字段与首页模板完全匹配
 * 模板使用: _id, image, typeTag, title, location, date, price, participantCount, participants(数组)
 */
export const mockHotActivities = [
  {
    _id: '1',
    title: '黄山日出两日游 | 观云海赏奇松',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    typeTag: '徒步·2天',
    location: '黄山风景区',
    date: '5月15日-16日',
    price: 299,
    participantCount: 28,
    participants: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop'
    ]
  },
  {
    _id: '2',
    title: '武功山高山草甸徒步',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    typeTag: '徒步·3天',
    location: '江西萍乡武功山',
    date: '5月20日-22日',
    price: 459,
    participantCount: 35,
    participants: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    ]
  },
  {
    _id: '3',
    title: '千岛湖环湖骑行之旅',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop',
    typeTag: '骑行·1天',
    location: '杭州千岛湖',
    date: '5月25日',
    price: 168,
    participantCount: 22,
    participants: [
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    ]
  }
]

/**
 * 往期活动 - 字段与首页模板完全匹配
 * 模板使用: _id, title, coverImage, activityDate, noteId
 */
export const mockPastActivities = [
  {
    _id: 'p1',
    title: '香山红叶观赏之旅',
    activityDate: '2025.10.15',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
    noteId: 'n1'
  },
  {
    _id: 'p2',
    title: '古北水镇秋日漫步',
    activityDate: '2025.09.20',
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=200&fit=crop',
    noteId: 'n2'
  }
]
