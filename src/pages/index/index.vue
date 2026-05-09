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
            <view class="banner-item" @click="goToDetail(banner.activityId || '')">
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
import { homeApi, noteApi } from '@/utils/http'
import { formatDateShort } from '@/utils/format'
import type { Banner, NavItem } from '@/types'

// 状态栏高度
const statusBarHeight = ref(44)
const loading = ref(false)

// 从 API 加载所有数据
const banners = ref<Banner[]>([])
const navItems = ref<NavItem[]>([])
const currentActivities = ref<any[]>([])
const pastActivities = ref<any[]>([])

// 精选游记（从API加载）
const featuredNote = ref<any>({
  _id: '',
  title: '',
  coverImage: '',
  author: { name: '', avatar: '' },
  participantCount: 0
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44
  
  // 加载首页数据
  loadHomeData()
})

// 加载首页数据
const loadHomeData = async () => {
  loading.value = true
  try {
    // 获取首页所有数据
    const res: any = await homeApi.getHomeData()
    
    banners.value = res.banners || []
    navItems.value = (res.navItems || []).slice(0, 4)
    
    // 转换热门活动数据格式
    currentActivities.value = (res.hotActivities || []).map((item: any) => {
      // participants 从对象数组转为头像字符串数组
      const avatars = (item.participants || []).map((p: any) => p.avatar || p).filter(Boolean)
      // 取第一张图片作为封面
      const coverImg = item.cover || (Array.isArray(item.images) ? item.images[0] : '')
      return {
        _id: item.id,
        title: item.title,
        image: coverImg,
        typeTag: Array.isArray(item.tags) ? item.tags.join('·') : '活动',
        location: item.location,
        date: formatDateShort(item.startDate),
        price: item.price,
        participantCount: item.participantCount,
        participants: avatars
      }
    })
    
    // 转换往期活动数据格式
    pastActivities.value = (res.pastActivities || []).map((item: any) => ({
      _id: item.id,
      title: item.title,
      coverImage: item.cover || (Array.isArray(item.images) ? item.images[0] : ''),
      activityDate: item.startDate,
      noteId: item.id
    }))
    
    // 加载精选游记（取第一条游记）
    try {
      const noteRes: any = await noteApi.getList({ status: 'approved', pageSize: 1 })
      const noteList = noteRes?.list || (Array.isArray(noteRes) ? noteRes : [])
      if (noteList.length > 0) {
        const n = noteList[0]
        featuredNote.value = {
          _id: n.id,
          title: n.title,
          coverImage: n.coverImage || (n.images && n.images[0]) || '',
          author: {
            name: n.authorName || '',
            avatar: n.authorAvatar || ''
          },
          participantCount: n.views || 0
        }
      }
    } catch (e) {
      // 游记加载失败不影响首页
    }
  } catch (error) {
    console.error('加载首页数据失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

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
