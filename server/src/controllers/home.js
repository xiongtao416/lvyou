/**
 * 首页数据控制器
 */
const db = require('../config/database')

// Banner数据（后期可改为数据库）
const banners = [
  {
    id: '1',
    activityId: '',  // 将在getHomeData中动态填充
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop',
    title: '黄山日出两日游',
    subtitle: '观云海赏奇松，登顶光明顶',
    badge: '热门'
  },
  {
    id: '2',
    activityId: '',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=400&fit=crop',
    title: '星空露营之夜',
    subtitle: '篝火晚会，仰望银河',
    badge: '推荐'
  },
  {
    id: '3',
    activityId: '',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
    title: '武功山徒步',
    subtitle: '高山草甸，云海日出',
    badge: ''
  }
]

// 金刚区导航
const navItems = [
  { label: '徒步登山', icon: '徒', bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'hiking' },
  { label: '露营野炊', icon: '营', bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'camping' },
  { label: '骑行探索', icon: '骑', bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', category: 'cycling' },
  { label: '水上运动', icon: '水', bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', category: 'water' },
  { label: '亲子活动', icon: '亲', bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', category: 'family' },
  { label: '摄影旅拍', icon: '摄', bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', category: 'photo' },
  { label: '极限挑战', icon: '极', bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', category: 'extreme' },
  { label: '周末短途', icon: '短', bgColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', category: 'weekend' }
]

// 获取Banner
exports.getBanners = (req, res) => {
  res.success(banners)
}

// 获取导航
exports.getNavItems = (req, res) => {
  res.success(navItems)
}

// 获取首页所有数据
exports.getHomeData = (req, res) => {
  // 热门活动
  const hotActivities = db.query(
    "SELECT * FROM activities WHERE status = 'registering' ORDER BY views DESC, participantCount DESC LIMIT 6"
  ).map(db.rowToObj)
  
  // 往期活动
  const pastActivities = db.query(
    "SELECT * FROM activities WHERE status IN ('completed', 'cancelled') ORDER BY createTime DESC LIMIT 4"
  ).map(db.rowToObj)
  
  // 动态关联banner和活动ID
  const bannerData = banners.map((b, i) => ({
    ...b,
    activityId: hotActivities[i] ? hotActivities[i].id : ''
  }))
  
  res.success({
    banners: bannerData,
    navItems,
    hotActivities,
    pastActivities
  })
}
