/**
 * 活动相关 Mock 数据
 * 阶段1: 本地Mock数据
 * 阶段2: 替换为后端API调用
 * 阶段3: 后端连接数据库
 */

import type { Activity, TimelineItem } from '@/types'

/**
 * 活动详情数据
 */
export const mockActivityData: Record<string, Activity> = {
  '1': {
    _id: '1',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop'
    ],
    tags: ['周边', '徒步'],
    title: '黄山日出两日游｜观云海赏奇松',
    startDate: '2026-05-15',
    location: '黄山风景区',
    price: 299,
    maxParticipants: 50,
    organizer: { 
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 
      nickName: '张老师' 
    },
    meetingPoint: '黄山南大门集合',
    participantCount: 28,
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', name: '李老师' },
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', name: '王老师' },
      { avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', name: '陈老师' }
    ],
    description: '<p style="line-height:1.8;color:#333;">黄山，天下第一奇山，以奇松、怪石、云海、温泉、冬雪"五绝"著称于世。</p><p style="line-height:1.8;color:#333;margin-top:12px;">本次活动我们将登顶光明顶，观赏壮丽的日出云海，漫步西海大峡谷。</p>',
    itinerary: [
      { 
        title: '登顶观日出，漫步西海', 
        expanded: true, 
        schedule: [
          { time: '07:30', content: '集合出发，乘坐大巴前往黄山' },
          { time: '10:00', content: '抵达黄山，换乘景区交通' },
          { time: '14:00', content: '游览西海大峡谷' },
          { time: '17:00', content: '入住山顶酒店' }
        ]
      },
      { 
        title: '游览前山，返程', 
        expanded: false, 
        schedule: [
          { time: '05:30', content: '早起观日出' },
          { time: '09:00', content: '游览迎客松' },
          { time: '14:00', content: '返程回京' }
        ]
      }
    ],
    feeInclude: ['往返大巴费用', '黄山景区门票', '山顶住宿一晚', '专业领队服务', '户外保险'],
    feeExclude: ['餐饮费用', '索道费用（可选）', '个人消费'],
    notices: [
      { title: '装备建议', content: '登山鞋、冲锋衣、保暖衣物、雨具、头灯、充电宝' },
      { title: '注意事项', content: '1. 活动前一天保证充足睡眠\n2. 携带身份证原件\n3. 服从领队安排' }
    ]
  },
  '2': {
    _id: '2',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=600&fit=crop'
    ],
    tags: ['长线', '徒步'],
    title: '武功山高山草甸徒步',
    startDate: '2026-05-20',
    location: '江西萍乡武功山',
    price: 459,
    maxParticipants: 30,
    organizer: { 
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', 
      nickName: '山野旅人' 
    },
    meetingPoint: '萍乡火车站集合',
    participantCount: 35,
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', name: '李老师' },
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', name: '王老师' }
    ],
    description: '<p style="line-height:1.8;color:#333;">武功山位于江西省萍乡市，以高山草甸、云海日出闻名。</p><p style="line-height:1.8;color:#333;margin-top:12px;">三天两夜徒步穿越，感受云海之上、星空之下的壮美。</p>',
    itinerary: [
      { 
        title: '进山，适应海拔', 
        expanded: true, 
        schedule: [
          { time: '08:00', content: '萍乡集合出发' },
          { time: '11:00', content: '开始登山' },
          { time: '16:00', content: '到达发云界扎营' }
        ]
      },
      { 
        title: '穿越草甸，观云海', 
        expanded: false, 
        schedule: [
          { time: '05:30', content: '早起观日出云海' },
          { time: '08:00', content: '沿山脊线穿越' },
          { time: '16:00', content: '到达金顶扎营' }
        ]
      },
      { 
        title: '下撤，返程', 
        expanded: false, 
        schedule: [
          { time: '06:00', content: '观日出' },
          { time: '09:00', content: '下撤出山' },
          { time: '15:00', content: '返程' }
        ]
      }
    ],
    feeInclude: ['往返交通', '帐篷睡袋租赁', '领队费', '户外保险', '餐费'],
    feeExclude: ['个人消费', '索道费用（可选）'],
    notices: [
      { title: '装备建议', content: '登山鞋、冲锋衣、保暖衣物、雨具、头灯、充电宝、个人药品' },
      { title: '注意事项', content: '1. 有一定体力要求\n2. 携带身份证原件\n3. 服从领队安排' }
    ]
  }
}

/**
 * 时间轴数据
 */
export const mockTimelineItems: TimelineItem[] = [
  {
    timeRange: '08:30-09:00',
    title: '集合签到',
    desc: '黄山南大门集合，领队点名签到，发放物资',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop',
    tags: ['集合'],
    isHighlight: false
  },
  {
    timeRange: '09:00-12:00',
    title: '乘索道上山',
    desc: '乘坐云谷索道上山，沿途欣赏黄山美景',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=200&fit=crop',
    tags: ['索道', '登山'],
    isHighlight: true
  },
  {
    timeRange: '12:00-13:30',
    title: '山顶午餐',
    desc: '在白云宾馆享用午餐，休息调整',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
    tags: ['用餐'],
    isHighlight: false
  },
  {
    timeRange: '13:30-17:00',
    title: '西海大峡谷',
    desc: '游览西海大峡谷，感受险峻峡谷风光',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    tags: ['景点', '徒步'],
    isHighlight: true
  },
  {
    timeRange: '17:00-18:00',
    title: '入住山顶酒店',
    desc: '入住白云宾馆，放下行李，休息',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop',
    tags: ['住宿'],
    isHighlight: false
  },
  {
    timeRange: '05:30-07:00',
    title: '日出云海',
    desc: '早起前往光明顶观赏壮丽日出云海',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=400&h=200&fit=crop',
    tags: ['日出', '必看'],
    isHighlight: true
  },
  {
    timeRange: '07:00-12:00',
    title: '游览前山',
    desc: '游览迎客松、百步云梯等经典景点',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=200&fit=crop',
    tags: ['景点'],
    isHighlight: true
  },
  {
    timeRange: '12:00-14:00',
    title: '返程下山',
    desc: '午餐后乘索道下山，返回集合点',
    image: '',
    tags: ['返程'],
    isHighlight: false
  }
]

/**
 * 活动列表数据（简化版）
 */
export const mockActivityList = [
  {
    _id: '1',
    title: '黄山日出两日游｜观云海赏奇松',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop',
    startDate: '2026-05-15',
    startTime: '07:30',
    location: '黄山风景区',
    price: 299
  },
  {
    _id: '2',
    title: '九华山祈福一日游｜登顶百岁宫',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop',
    startDate: '2026-05-20',
    startTime: '08:00',
    location: '池州九华山',
    price: 168
  }
]

/**
 * 获取活动详情
 * @param id 活动ID
 */
export const getActivityById = (id: string): Activity => {
  return mockActivityData[id] || mockActivityData['1']
}

/**
 * 获取活动列表
 */
export const getActivityList = () => {
  return Object.values(mockActivityData)
}
