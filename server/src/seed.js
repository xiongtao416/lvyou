/**
 * 种子数据 - SQLite版
 * 运行: node src/seed.js
 */
const db = require('./config/database')

const seedActivities = [
  {
    title: '黄山日出两日游｜观云海赏奇松',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop'],
    tags: ['周边', '徒步'],
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    startDate: '2026-05-15', startTime: '07:30', endDate: '2026-05-16',
    location: '黄山风景区', meetingPoint: '黄山南大门集合',
    price: 299, maxParticipants: 50, participantCount: 28,
    organizer: { avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', nickName: '张老师' },
    description: '<p style="line-height:1.8;color:#333;">黄山，天下第一奇山。</p>',
    itinerary: [
      { title: '登顶观日出，漫步西海', expanded: true, schedule: [
        { time: '07:30', content: '集合签到，领队点名签到，发放物资', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop' },
        { time: '09:00', content: '乘坐云谷索道上山，沿途欣赏黄山美景', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop' },
        { time: '12:00', content: '在白云宾馆享用午餐，休息调整', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
        { time: '14:00', content: '游览西海大峡谷，漫步栈道', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop' },
        { time: '17:00', content: '入住山顶酒店，自由活动', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }
      ]},
      { title: '游览前山，返程', expanded: false, schedule: [
        { time: '05:30', content: '早起观日出云海', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' },
        { time: '09:00', content: '游览迎客松、光明顶', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop' },
        { time: '12:00', content: '午餐后下山', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop' },
        { time: '14:00', content: '返程回京', image: '' }
      ]}
    ],
    feeInclude: ['往返大巴', '门票', '住宿', '领队', '保险'],
    feeExclude: ['餐饮', '索道'],
    notices: [{ title: '装备建议', content: '登山鞋、冲锋衣' }],
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', name: '李老师' },
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', name: '王老师' }
    ],
    status: 'registering', views: 2340, likes: 186
  },
  {
    title: '武功山高山草甸徒步',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
    tags: ['长线', '徒步'],
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    startDate: '2026-05-20', startTime: '08:00', endDate: '2026-05-22',
    location: '江西萍乡武功山', meetingPoint: '萍乡火车站',
    price: 459, maxParticipants: 40, participantCount: 35,
    organizer: { avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', nickName: '山野旅人' },
    description: '<p>武功山高山草甸徒步。</p>',
    itinerary: [
      { title: '进山，适应海拔', expanded: true, schedule: [
        { time: '08:00', content: '萍乡集合出发', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
        { time: '11:00', content: '开始登山，沿途欣赏美景', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop' },
        { time: '16:00', content: '到达发云界扎营', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' }
      ]},
      { title: '穿越草甸，观云海', expanded: false, schedule: [
        { time: '05:30', content: '早起观日出云海', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop' },
        { time: '08:00', content: '沿山脊线穿越高山草甸', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop' },
        { time: '16:00', content: '到达金顶扎营', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop' }
      ]},
      { title: '下撤，返程', expanded: false, schedule: [
        { time: '06:00', content: '观日出', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' },
        { time: '09:00', content: '下撤出山', image: '' },
        { time: '15:00', content: '返程', image: '' }
      ]}
    ],
    feeInclude: ['交通', '帐篷', '领队', '保险'],
    feeExclude: ['个人消费'],
    notices: [{ title: '注意', content: '有一定体力要求' }],
    participants: [],
    status: 'registering', views: 1890, likes: 142
  },
  {
    title: '千岛湖环湖骑行之旅',
    images: ['https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=600&fit=crop'],
    tags: ['骑行', '周末'],
    cover: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop',
    startDate: '2026-05-25', startTime: '07:00', endDate: '2026-05-25',
    location: '杭州千岛湖', meetingPoint: '千岛湖游客中心',
    price: 168, maxParticipants: 30, participantCount: 22,
    organizer: { avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', nickName: '张老师' },
    description: '<p>千岛湖环湖骑行。</p>',
    itinerary: [
      { title: '环湖骑行', expanded: true, schedule: [
        { time: '07:00', content: '集合出发，领取自行车', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop' },
        { time: '09:00', content: '沿湖骑行，欣赏湖光山色', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop' },
        { time: '12:00', content: '午餐休息', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
        { time: '17:00', content: '返程', image: '' }
      ]}
    ],
    feeInclude: ['自行车租赁', '保险'],
    feeExclude: ['餐饮'],
    notices: [],
    participants: [],
    status: 'registering', views: 1560, likes: 98
  }
]

const seedNotes = [
  {
    title: '武功山三日徒步穿越：云海之上，星空之下',
    authorId: 'user2',
    authorName: '山野旅人',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
    content: '四月的武功山，草甸刚刚返青，漫山遍野的绿意与蓝天白云交相辉映。我们从萍乡出发，沿着经典的徒步路线，用三天时间完成了这次穿越之旅。一路上，云海翻涌，日出壮丽，星空璀璨，每一步都是对自然的敬畏与感动。\n\n第二天清晨五点，我们在帐篷中被冻醒，裹着睡袋爬出帐篷的那一刻，眼前的景象让所有人都屏住了呼吸。云海从山谷中翻涌而上，远处的山峰在云层中若隐若现，第一缕阳光穿透云层，将整个天空染成了金色。那一刻，所有的疲惫都烟消云散了。\n\n中午时分，我们沿着山脊线继续前行。武功山的高山草甸在春季呈现出最美的状态，嫩绿的草丛中点缀着不知名的野花。远处是连绵起伏的山峦，近处是随风摇曳的草浪，仿佛置身于一幅巨大的油画之中。',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'],
    tags: ['武功山', '徒步', '云海', '露营'],
    views: 3862, likes: 326, favorites: 158, commentCount: 42,
    status: 'approved'
  },
  {
    title: '千岛湖骑行日记：追风环湖100公里',
    authorId: 'user1',
    authorName: '户外爱好者',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=600&fit=crop',
    content: '千岛湖环湖骑行，全程约100公里。清晨出发时薄雾笼罩湖面，骑行在蜿蜒的环湖公路上，一边是碧绿的湖水，一边是翠绿的山峦。沿途经过多个观景台，每到一处都忍不住停下来拍照。下午到达终点时，虽然双腿酸痛，但内心充满了成就感。',
    images: ['https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop'],
    tags: ['千岛湖', '骑行', '周末'],
    views: 2156, likes: 198, favorites: 87, commentCount: 23,
    status: 'approved'
  }
]

const seedUsers = [
  { nickname: '户外爱好者', name: '张老师', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', phone: '13800008888', gender: 1, department: '计算机学院', role: 'super_admin', stats: { joinCount: 12, upcomingCount: 2, noteCount: 5 } },
  { nickname: '山野旅人', name: '李老师', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', phone: '13900005678', gender: 1, department: '体育学院', role: 'admin', stats: { joinCount: 8, upcomingCount: 1, noteCount: 3 } }
]

// 清空并导入
const { run } = require('./config/database')
run('DELETE FROM activities')
run('DELETE FROM users')
run('DELETE FROM registrations')
run('DELETE FROM notes')

seedActivities.forEach(a => db.create('activities', a))
seedUsers.forEach(u => db.create('users', u))
seedNotes.forEach(n => db.create('notes', n))

console.log(`✅ 种子数据导入完成: ${seedActivities.length} 活动, ${seedUsers.length} 用户, ${seedNotes.length} 游记`)
process.exit(0)
