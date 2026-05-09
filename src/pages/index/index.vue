<template>
  <view class="page-container">
    <!-- 顶部区域 -->
    <view class="header-section">
      <view class="header-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="logo-area">
          <text class="logo-text">户外探索</text>
          <text class="logo-slogan">发现精彩旅程</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="main-scroll" @scrolltolower="loadMore">
      <!-- Banner轮播 -->
      <view class="banner-section">
        <swiper
          class="banner-swiper"
          :indicator-dots="true"
          :autoplay="true"
          :interval="4000"
          indicator-color="rgba(255,255,255,0.5)"
          indicator-active-color="#FFD000"
        >
          <swiper-item v-for="(banner, index) in banners" :key="index">
            <view class="banner-item" @click="goToDetail(banner.id)">
              <image class="banner-image" :src="banner.image" mode="aspectFill" />
              <view class="banner-badge" v-if="banner.badge">
                <text class="badge-text">{{ banner.badge }}</text>
              </view>
              <view class="banner-overlay">
                <text class="banner-title">{{ banner.title }}</text>
                <text class="banner-subtitle">{{ banner.subtitle }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 金刚区导航 -->
      <view class="nav-section">
        <view class="nav-grid">
          <view
            class="nav-item"
            v-for="(item, index) in navItems"
            :key="index"
            @click="handleNavClick(item)"
          >
            <view class="nav-icon" :style="{ background: item.bgColor }">
              <text class="nav-icon-text">{{ item.icon }}</text>
            </view>
            <text class="nav-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 精选活动 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title-area">
            <text class="section-title">精选活动</text>
            <text class="section-subtitle">发现你的下一段旅程</text>
          </view>
          <text class="section-more" @click="goToMore('current')">更多 ></text>
        </view>

        <scroll-view scroll-x class="activity-scroll">
          <view class="activity-cards">
            <view
              class="activity-card"
              v-for="activity in currentActivities"
              :key="activity._id"
              @click="goToDetail(activity._id)"
            >
              <view class="card-image-wrap">
                <image class="card-image" :src="activity.image" mode="aspectFill" />
                <view class="card-type-tag">
                  <text class="type-tag-text">{{ activity.typeTag }}</text>
                </view>
              </view>
              <view class="card-content">
                <text class="card-title">{{ activity.title }}</text>
                <view class="card-meta">
                  <text class="card-location">{{ activity.location }}</text>
                  <text class="card-date">{{ activity.date }}</text>
                </view>
                <view class="card-footer">
                  <view class="card-participants">
                    <image
                      class="p-avatar"
                      v-for="(p, i) in activity.participants"
                      :key="i"
                      :src="p"
                    />
                    <text class="p-count">{{ activity.participantCount }}人已报名</text>
                  </view>
                  <view class="card-right-area">
                    <view class="share-btn" @click.stop="handleShare(activity)">
                      <text class="share-icon">&#xe60a;</text>
                    </view>
                    <text class="card-price">¥{{ activity.price }}/人</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 历历在目 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title-area">
            <text class="section-title">历历在目</text>
            <text class="section-subtitle">那些美好的旅行记忆</text>
          </view>
          <text class="section-more" @click="goToMore('memory')">更多 ></text>
        </view>

        <!-- 精选游记大卡片 -->
        <view class="featured-note" @click="goToNote(featuredNote._id)">
          <image class="featured-image" :src="featuredNote.coverImage" mode="aspectFill" />
          <view class="featured-overlay">
            <text class="featured-title">{{ featuredNote.title }}</text>
            <view class="featured-author">
              <image class="author-avatar" :src="featuredNote.author.avatar" />
              <text class="author-name">{{ featuredNote.author.name }}</text>
              <text class="author-info">· {{ featuredNote.participantCount }}人参与</text>
            </view>
          </view>
        </view>

        <!-- 往期活动网格 -->
        <view class="past-grid">
          <view
            class="past-card"
            v-for="activity in pastActivities"
            :key="activity._id"
            @click="goToNote(activity.noteId)"
          >
            <image class="past-image" :src="activity.coverImage" mode="aspectFill" />
            <view class="past-content">
              <text class="past-title">{{ activity.title }}</text>
              <text class="past-date">{{ activity.activityDate }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view class="bottom-safe"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(44)

// Banner数据
const banners = ref([
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
    badge: '限时'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
    title: '雪山徒步挑战赛',
    subtitle: '征服高峰，遇见更好的自己',
    badge: '热门'
  }
])

// 金刚区导航 - 4个核心分类
const navItems = ref([
  { label: '徒步登山', icon: '徒', bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'hiking' },
  { label: '露营野炊', icon: '营', bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'camping' },
  { label: '亲子活动', icon: '亲', bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', category: 'family' },
  { label: '特价优惠', icon: '惠', bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', category: 'discount' }
])

// 当前活动
const currentActivities = ref([
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
])

// 往期活动
const pastActivities = ref([
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
])

// 精选游记
const featuredNote = ref({
  _id: 'n1',
  title: '金秋十月，香山红叶漫山红遍',
  coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=400&fit=crop',
  author: {
    name: '张老师',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
  },
  participantCount: 32
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44
})

// 导航点击
const handleNavClick = (item: any) => {
  uni.showToast({ title: `${item.label}分类（开发中）`, icon: 'none' })
}

// 跳转详情
const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/activity/detail?id=${id}` })
}

// 跳转游记
const goToNote = (id: string) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${id}` })
}

// 查看更多
const goToMore = (type: string) => {
  uni.navigateTo({ url: `/pages/activity/list?type=${type}` })
}

// 分享
const handleShare = (activity: any) => {
  uni.showActionSheet({
    itemList: ['分享给微信好友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      const actions = ['分享给微信好友', '分享到朋友圈', '复制链接']
      uni.showToast({ title: actions[res.tapIndex], icon: 'none' })
    }
  })
}

// 加载更多
const loadMore = () => {
  // 分页加载
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* ========== 顶部区域 ========== */
.header-section {
  background: #fff;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
}

.logo-area {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  letter-spacing: 1px;
}

.logo-slogan {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #FFD000 0%, #FFA500 100%);
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(255, 208, 0, 0.3);
}

.btn-icon {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.btn-text {
  font-size: 13px;
  color: #333;
  font-weight: 600;
}

/* ========== 主滚动区域 ========== */
.main-scroll {
  height: calc(100vh - 70px);
}

/* ========== Banner轮播 ========== */
.banner-section {
  padding: 0 16px;
  margin-top: 12px;
}

.banner-swiper {
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%);
  padding: 4px 12px;
  border-radius: 12px;
  z-index: 2;
}

.badge-text {
  font-size: 11px;
  color: #fff;
  font-weight: 600;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 16px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.banner-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.banner-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* ========== 金刚区导航 ========== */
.nav-section {
  background: #fff;
  margin: 16px;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nav-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.nav-icon-text {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
}

.nav-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

/* ========== 通用Section ========== */
.section {
  margin: 20px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.section-title-area {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.section-more {
  font-size: 13px;
  color: #FFD000;
  font-weight: 500;
}

/* ========== 精选活动横向滚动 ========== */
.activity-scroll {
  white-space: nowrap;
}

.activity-cards {
  display: inline-flex;
  gap: 12px;
  padding-right: 16px;
}

.activity-card {
  width: 280px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.card-image-wrap {
  position: relative;
  width: 100%;
  height: 160px;
}

.card-image {
  width: 100%;
  height: 100%;
}

.card-type-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.5);
  padding: 3px 10px;
  border-radius: 10px;
}

.type-tag-text {
  font-size: 11px;
  color: #fff;
  font-weight: 500;
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  font-size: 11px;
  color: #999;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.card-participants {
  display: flex;
  align-items: center;
  gap: 0;
}

.p-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -6px;

  &:first-child {
    margin-left: 0;
  }
}

.p-count {
  font-size: 11px;
  color: #999;
  margin-left: 6px;
}

.card-right-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.share-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon {
  font-size: 14px;
  color: #999;
}

.card-price {
  font-size: 16px;
  font-weight: 700;
  color: #FF6B00;
}

.bottom-safe {
  height: 30px;
}

/* ========== 历历在目 ========== */
.featured-note {
  position: relative;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.featured-image {
  width: 100%;
  height: 100%;
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 16px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.featured-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.featured-author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: #fff;
}

.author-info {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

/* ========== 往期活动网格 ========== */
.past-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.past-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.past-image {
  width: 100%;
  height: 100px;
}

.past-content {
  padding: 10px;
}

.past-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.past-date {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  display: block;
}
</style>
