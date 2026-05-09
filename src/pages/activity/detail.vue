<template>
  <view class="detail-page">
    <!-- 顶部浮动Tab栏 -->
    <view class="floating-tab-bar" :class="{ show: showFloatingTab }" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="floating-content">
        <view class="floating-back" @click="goBack">←</view>
        <view class="floating-tabs">
          <view v-for="(tab, index) in tabs" :key="index" class="floating-tab-item" :class="{ active: currentTab === index }" @click="scrollToTab(index)">
            {{ tab }}
          </view>
        </view>
        <view class="floating-right"></view>
      </view>
    </view>

    <!-- 页面内容 -->
    <scroll-view scroll-y class="page-scroll" @scroll="onScroll" :scroll-into-view="scrollToView" scroll-with-animation>
      <!-- 顶部封面 -->
      <view class="hero-section">
        <swiper class="image-swiper" :indicator-dots="true" :autoplay="false" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#FFD000">
          <swiper-item v-for="(img, index) in activity.images" :key="index">
            <image class="hero-image" :src="img" mode="aspectFill" @error="onImageError" />
          </swiper-item>
        </swiper>
        <view class="back-btn" @click="goBack">←</view>
        <view class="hero-info">
          <view class="hero-tags">
            <text class="tag" v-for="(tag, i) in activity.tags" :key="i">{{ tag }}</text>
          </view>
          <text class="hero-title">{{ activity.title }}</text>
        </view>
      </view>

      <!-- 快捷信息 -->
      <view class="quick-info">
        <view class="info-item">
          <text class="info-label">活动时间</text>
          <text class="info-value">{{ formatDate(activity.startDate) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">集合地点</text>
          <text class="info-value">{{ activity.location }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">活动费用</text>
          <text class="info-value price">¥{{ activity.price }}</text>
        </view>
      </view>

      <!-- 图文介绍 -->
      <view id="tab-0" class="section-block">
        <view class="section-header-title">图文介绍</view>
        <view class="organizer-card">
          <image class="org-avatar" :src="activity.organizer?.avatarUrl" />
          <view class="org-info">
            <text class="org-name">{{ activity.organizer?.nickName }}</text>
            <text class="org-tag">活动组织者</text>
          </view>
          <button class="org-btn" size="mini">联系TA</button>
        </view>
        <view class="map-section">
          <text class="section-title">集合地点</text>
          <view class="map-box">
            <view class="map-placeholder">
              <text>📍</text>
              <text>{{ activity.meetingPoint }}</text>
            </view>
          </view>
        </view>
        <view class="participants-section">
          <view class="section-header">
            <text class="section-title">已报名小伙伴</text>
            <text class="section-sub">共{{ activity.participantCount }}人</text>
          </view>
          <view class="participant-list">
            <view class="p-item" v-for="(p, i) in activity.participants" :key="i">
              <image class="p-avatar" :src="p.avatar" />
              <text class="p-name">{{ p.name }}</text>
            </view>
          </view>
        </view>
        <view class="intro-section">
          <text class="section-title">活动介绍</text>
          <rich-text :nodes="activity.description"></rich-text>
        </view>
      </view>

      <!-- 行程安排 - 时间轴风格 -->
      <view id="anchor-1" class="scroll-spacer"></view>
      <view id="tab-1" class="section-block">
        <view class="section-header-title">行程安排</view>
        <view class="timeline-container">
          <view class="timeline-item" v-for="(item, i) in timelineItems" :key="i">
            <view class="timeline-time-section">
              <text class="time-tag">{{ item.timeRange }}</text>
            </view>
            <view class="timeline-dot"></view>
            <view class="timeline-content">
              <view class="timeline-card" :class="{ highlight: item.isHighlight }">
                <image v-if="item.image" class="timeline-img" :src="item.image" mode="aspectFill" />
                <view class="timeline-info">
                  <text class="timeline-title">{{ item.title }}</text>
                  <text class="timeline-desc" v-if="item.desc">{{ item.desc }}</text>
                  <view class="timeline-tags" v-if="item.tags && item.tags.length">
                    <text class="timeline-tag" v-for="(tag, idx) in item.tags" :key="idx">{{ tag }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 费用说明 -->
      <view id="anchor-2" class="scroll-spacer"></view>
      <view id="tab-2" class="section-block">
        <view class="section-header-title">费用说明</view>
        <view class="fee-section">
          <view class="fee-block">
            <view class="fee-title"><text class="fee-icon">✓</text><text>费用包含</text></view>
            <view class="fee-list">
              <text class="fee-item" v-for="(item, i) in activity.feeInclude" :key="i">{{ item }}</text>
            </view>
          </view>
          <view class="fee-block">
            <view class="fee-title exclude"><text class="fee-icon">✗</text><text>费用不含</text></view>
            <view class="fee-list">
              <text class="fee-item" v-for="(item, i) in activity.feeExclude" :key="i">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 活动须知 -->
      <view id="anchor-3" class="scroll-spacer"></view>
      <view id="tab-3" class="section-block">
        <view class="section-header-title">活动须知</view>
        <view class="notice-section">
          <view class="notice-item" v-for="(notice, i) in activity.notices" :key="i">
            <text class="notice-title">{{ notice.title }}</text>
            <text class="notice-content">{{ notice.content }}</text>
          </view>
        </view>
      </view>

      <view style="height: 80px;"></view>
    </scroll-view>

    <!-- 底部操作栏 - 深色胶囊容器 -->
    <view class="bottom-container">
      <view class="share-btn" @click="handleWechatShare">
        <view class="share-icon-wrap">
          <view class="share-bubble">
            <view class="bubble-dot"></view>
            <view class="bubble-dot"></view>
          </view>
        </view>
        <text class="share-label">分享</text>
      </view>
      <view class="consult-btn" @click="handleConsult">
        <image class="consult-avatar" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" mode="aspectFill" />
        <text class="consult-label">在线咨询</text>
      </view>
      <button class="book-btn" @click="handleJoin">立即报名</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getRouteParam } from '@/utils/route'

const statusBarHeight = ref(44)
const tabs = ['图文', '行程', '费用', '须知']
const currentTab = ref(0)
const showFloatingTab = ref(false)
const scrollToView = ref('')
const isFavorite = ref(false)

// 各区块的顶部位置（动态计算）
const sectionTops = ref<number[]>([0, 0, 0, 0])
const tabNavHeight = 100 // Tab导航高度 + 安全距离

// 模拟活动数据
const mockActivityData: Record<string, any> = {
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
    organizer: { avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', nickName: '张老师' },
    meetingPoint: '黄山南大门集合',
    participantCount: 28,
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', name: '李老师' },
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', name: '王老师' },
      { avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', name: '陈老师' }
    ],
    description: '<p style="line-height:1.8;color:#333;">黄山，天下第一奇山，以奇松、怪石、云海、温泉、冬雪"五绝"著称于世。</p><p style="line-height:1.8;color:#333;margin-top:12px;">本次活动我们将登顶光明顶，观赏壮丽的日出云海，漫步西海大峡谷。</p>',
    itinerary: [
      { title: '登顶观日出，漫步西海', expanded: true, schedule: [
        { time: '07:30', content: '集合出发，乘坐大巴前往黄山' },
        { time: '10:00', content: '抵达黄山，换乘景区交通' },
        { time: '14:00', content: '游览西海大峡谷' },
        { time: '17:00', content: '入住山顶酒店' }
      ]},
      { title: '游览前山，返程', expanded: false, schedule: [
        { time: '05:30', content: '早起观日出' },
        { time: '09:00', content: '游览迎客松' },
        { time: '14:00', content: '返程回京' }
      ]}
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
    organizer: { avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', nickName: '山野旅人' },
    meetingPoint: '萍乡火车站集合',
    participantCount: 35,
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', name: '李老师' },
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', name: '王老师' }
    ],
    description: '<p style="line-height:1.8;color:#333;">武功山位于江西省萍乡市，以高山草甸、云海日出闻名。</p><p style="line-height:1.8;color:#333;margin-top:12px;">三天两夜徒步穿越，感受云海之上、星空之下的壮美。</p>',
    itinerary: [
      { title: '进山，适应海拔', expanded: true, schedule: [
        { time: '08:00', content: '萍乡集合出发' },
        { time: '11:00', content: '开始登山' },
        { time: '16:00', content: '到达发云界扎营' }
      ]},
      { title: '穿越草甸，观云海', expanded: false, schedule: [
        { time: '05:30', content: '早起观日出云海' },
        { time: '08:00', content: '沿山脊线穿越' },
        { time: '16:00', content: '到达金顶扎营' }
      ]},
      { title: '下撤，返程', expanded: false, schedule: [
        { time: '06:00', content: '观日出' },
        { time: '09:00', content: '下撤出山' },
        { time: '15:00', content: '返程' }
      ]}
    ],
    feeInclude: ['往返交通', '帐篷睡袋租赁', '领队费', '户外保险', '餐费'],
    feeExclude: ['个人消费', '索道费用（可选）'],
    notices: [
      { title: '装备建议', content: '登山鞋、冲锋衣、保暖衣物、雨具、头灯、充电宝、个人药品' },
      { title: '注意事项', content: '1. 有一定体力要求\n2. 携带身份证原件\n3. 服从领队安排' }
    ]
  }
}

const activity = ref<any>({})

// 时间轴数据
const timelineItems = ref([
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
])

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44

  // 获取路由参数 id（使用统一工具）
  const id = getRouteParam('id')

  // 根据 id 加载对应活动数据
  activity.value = mockActivityData[id] || mockActivityData['1']

  // 延迟计算各区块位置
  nextTick(() => {
    setTimeout(() => {
      calculateSectionPositions()
    }, 300)
  })
})

// 动态计算各区块位置
const calculateSectionPositions = () => {
  const query = uni.createSelectorQuery()
  query.select('#tab-0').boundingClientRect()
  query.select('#anchor-1').boundingClientRect()
  query.select('#anchor-2').boundingClientRect()
  query.select('#anchor-3').boundingClientRect()
  query.selectViewport().scrollOffset()
  query.exec((res) => {
    if (res && res[4]) {
      const scrollTop = res[4].scrollTop || 0
      // 计算各区块相对于页面顶部的位置
      res.slice(0, 4).forEach((rect: any, index: number) => {
        if (rect) {
          sectionTops.value[index] = rect.top + scrollTop - tabNavHeight
        }
      })
    }
  })
}

const onScroll = (e: any) => {
  const scrollTop = e.detail.scrollTop
  showFloatingTab.value = scrollTop > 280

  // 根据动态计算的位置切换Tab
  const tops = sectionTops.value
  if (tops[3] > 0 && scrollTop >= tops[3]) {
    currentTab.value = 3
  } else if (tops[2] > 0 && scrollTop >= tops[2]) {
    currentTab.value = 2
  } else if (tops[1] > 0 && scrollTop >= tops[1]) {
    currentTab.value = 1
  } else {
    currentTab.value = 0
  }
}

const scrollToTab = (index: number) => {
  currentTab.value = index
  // 使用锚点占位元素定位，避免标题被Tab导航遮挡
  if (index === 0) {
    scrollToView.value = 'tab-0'
  } else {
    scrollToView.value = `anchor-${index}`
  }
  setTimeout(() => { scrollToView.value = '' }, 500)
}

const toggleDay = (index: number) => {
  activity.value.itinerary[index].expanded = !activity.value.itinerary[index].expanded
}

// 图片加载失败处理
const onImageError = (e: any) => {
  // 使用默认占位图
  const defaultImage = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'
  // 如果原图加载失败，替换为默认图
  if (e && e.currentTarget) {
    e.currentTarget.src = defaultImage
  }
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const goBack = () => { uni.navigateBack() }
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({ title: isFavorite.value ? '已收藏' : '已取消收藏', icon: 'none' })
}
const handleShare = () => {
  uni.showActionSheet({ itemList: ['分享到微信好友', '分享到朋友圈', '复制链接'] })
}

// 微信分享
const handleWechatShare = () => {
  uni.showActionSheet({
    itemList: ['分享给微信好友', '分享到朋友圈'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.showToast({ title: '已唤起微信分享', icon: 'success' })
      } else if (res.tapIndex === 1) {
        uni.showToast({ title: '已唤起朋友圈分享', icon: 'success' })
      }
    }
  })
}

// 在线咨询
const handleConsult = () => {
  uni.showToast({ title: '客服连接中...', icon: 'none' })
}
const handleJoin = () => { uni.navigateTo({ url: '/pages/activity/register?id=' + (activity.value._id || '1') }) }
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; background: #f5f5f5; position: relative; }

.floating-tab-bar {
  position: fixed; top: 0; left: 0; right: 0; background: #fff; z-index: 100;
  transform: translateY(-100%); opacity: 0; transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  &.show { transform: translateY(0); opacity: 1; }
}
.floating-content { display: flex; align-items: center; justify-content: space-between; height: 44px; padding: 0 12px; }
.floating-back { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #333; }
.floating-tabs { display: flex; gap: 28px; }
.floating-tab-item { font-size: 15px; color: #999; padding: 8px 2px; position: relative;
  &.active { color: #333; font-weight: 600;
    &::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 20px; height: 3px; background: #FFD000; border-radius: 2px; }
  }
}
.floating-right { width: 32px; }

.page-scroll { height: 100vh; }

.hero-section { position: relative; height: 280px; }
.image-swiper { height: 100%; }
.hero-image { width: 100%; height: 100%; }
.back-btn { position: absolute; top: 50px; left: 15px; width: 40px; height: 40px; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); z-index: 10; }
.hero-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 60px 16px 20px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); }
.hero-tags { display: flex; gap: 8px; margin-bottom: 10px; }
.tag { background: #FFD000; color: #333; font-size: 12px; padding: 4px 10px; border-radius: 4px; }
.hero-title { color: #fff; font-size: 20px; font-weight: 700; line-height: 1.4; }

.quick-info { display: flex; background: #fff; padding: 16px 0; }
.info-item { flex: 1; text-align: center; border-right: 1px solid #f0f0f0; &:last-child { border-right: none; } }
.info-label { display: block; font-size: 12px; color: #999; margin-bottom: 6px; }
.info-value { font-size: 15px; color: #333; font-weight: 500; &.price { color: #FF6B00; font-size: 18px; font-weight: 700; } }

.section-block { background: #fff; margin-top: 12px; padding: 16px; }
.scroll-spacer { height: 100px; }
.section-header-title { font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f5f5f5; }
.section-title { font-size: 15px; font-weight: 600; color: #333; margin-bottom: 10px; display: block; }

.organizer-card { display: flex; align-items: center; background: #f8f8f8; padding: 14px; border-radius: 12px; margin-bottom: 16px; }
.org-avatar { width: 48px; height: 48px; border-radius: 50%; margin-right: 12px; }
.org-info { flex: 1; }
.org-name { display: block; font-size: 15px; font-weight: 600; color: #333; margin-bottom: 4px; }
.org-tag { font-size: 12px; color: #999; }
.org-btn { background: #4A90D9; color: #fff; font-size: 13px; padding: 6px 14px; border-radius: 16px; border: none; }

.map-section { margin-bottom: 16px; }
.map-box { height: 120px; background: #e8f4fd; border-radius: 12px; overflow: hidden; }
.map-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #4A90D9; font-size: 14px; gap: 8px; }

.participants-section { margin-bottom: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-sub { font-size: 13px; color: #999; }
.participant-list { display: flex; flex-wrap: wrap; gap: 14px; }
.p-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.p-avatar { width: 44px; height: 44px; border-radius: 50%; }
.p-name { font-size: 11px; color: #666; }

/* 时间轴样式 */
.timeline-container { position: relative; padding-left: 100px; padding-right: 16px; }
.timeline-container::before { content: ''; position: absolute; left: 85px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #FFD000, #FFA500); }
.timeline-item { position: relative; margin-bottom: 20px; }
.timeline-time-section { position: absolute; left: -100px; top: 0; width: 90px; text-align: right; }
.time-tag { display: inline-block; background: #FFF8E1; color: #F57C00; font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 500; }
.timeline-dot { position: absolute; left: -19px; top: 8px; width: 12px; height: 12px; background: #FFD000; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(255, 208, 0, 0.4); z-index: 1; }
.timeline-content { margin-left: 0; }
.timeline-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); border: 1px solid #f0f0f0; }
.timeline-card.highlight { border-left: 3px solid #FFD000; }
.timeline-img { width: 100%; height: 120px; }
.timeline-info { padding: 12px; }
.timeline-title { display: block; font-size: 15px; font-weight: 600; color: #333; margin-bottom: 6px; }
.timeline-desc { display: block; font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 8px; }
.timeline-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.timeline-tag { font-size: 11px; color: #999; background: #f5f5f5; padding: 2px 8px; border-radius: 10px; }

.fee-section { display: flex; flex-direction: column; gap: 16px; }
.fee-block { background: #f8f8f8; border-radius: 12px; padding: 14px; }
.fee-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: #52C41A; margin-bottom: 10px; &.exclude { color: #FF6B6B; } }
.fee-icon { width: 20px; height: 20px; border-radius: 50%; background: currentColor; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.fee-list { padding-left: 28px; }
.fee-item { display: block; font-size: 14px; color: #666; padding: 6px 0; border-bottom: 1px dashed #e0e0e0; &:last-child { border-bottom: none; } }

.notice-section { display: flex; flex-direction: column; gap: 16px; }
.notice-item { background: #f8f8f8; border-radius: 12px; padding: 14px; }
.notice-title { display: block; font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px; }
.notice-content { font-size: 14px; color: #666; line-height: 1.6; white-space: pre-line; }

/* 底部操作栏 - 深色胶囊容器 */
.bottom-container { position: fixed; bottom: 12px; left: 16px; right: 16px; display: flex; align-items: center; padding: 8px 12px; padding-bottom: calc(8px + env(safe-area-inset-bottom)); background: #1a1a1a; border-radius: 12px; z-index: 50; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); }

/* 分享按钮 */
.share-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; padding: 4px 8px; }
.share-btn:active { opacity: 0.8; }
.share-icon-wrap { width: 40px; height: 40px; border-radius: 10px; background: #07C160; display: flex; align-items: center; justify-content: center; }
.share-bubble { width: 22px; height: 18px; border: 2px solid #fff; border-radius: 4px; position: relative; display: flex; align-items: center; justify-content: center; gap: 2px; }
.share-bubble::after { content: ''; position: absolute; bottom: -4px; left: 3px; width: 6px; height: 6px; background: #07C160; border-right: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(45deg); }
.bubble-dot { width: 3px; height: 3px; border-radius: 50%; background: #fff; }
.share-label { font-size: 10px; color: #fff; }

/* 在线咨询 - 矩形胶囊 */
.consult-btn { flex: 1; height: 40px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0 8px; flex-shrink: 0; }
.consult-btn:active { opacity: 0.85; }
.consult-avatar { width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0; }
.consult-label { font-size: 14px; color: #333; font-weight: 500; }

/* 立即报名 - 矩形胶囊 */
.book-btn { flex: 1.2; height: 40px; background: #FFD100; color: #000; font-size: 15px; font-weight: 700; border-radius: 10px; border: none; letter-spacing: 1px; flex-shrink: 0; }
.book-btn:active { opacity: 0.9; }
</style>
