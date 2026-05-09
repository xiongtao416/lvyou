<template>
  <view class="profile-page">
    <!-- 顶部用户卡片 -->
    <view class="user-card" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="user-card-inner">
        <view class="user-top">
          <image
            class="user-avatar"
            :src="userInfo.avatar"
            mode="aspectFill"
          />
          <view class="user-info">
            <text class="user-name">{{ userInfo.name }}</text>
            <text class="user-department">{{ userInfo.department }}</text>
          </view>
          <view class="edit-btn" @click="goToEdit">
            <text class="edit-btn-text">编辑资料</text>
          </view>
        </view>

        <!-- 统计数据 -->
        <view class="user-stats">
          <view class="stat-item" @click="goToMyActivities('all')">
            <text class="stat-num">{{ userInfo.stats.joinCount }}</text>
            <text class="stat-label">参加活动</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item" @click="goToMyActivities('upcoming')">
            <text class="stat-num">{{ userInfo.stats.upcomingCount }}</text>
            <text class="stat-label">即将开始</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item" @click="goToMyNotes">
            <text class="stat-num">{{ userInfo.stats.noteCount }}</text>
            <text class="stat-label">发布游记</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="main-scroll">
      <!-- 我的活动模块 -->
      <view class="section-block">
        <view class="section-header">
          <text class="section-title">我的活动</text>
          <text class="section-more" @click="goToMyActivities('all')">查看全部 ></text>
        </view>

        <!-- Tab切换 -->
        <view class="tab-bar">
          <view
            class="tab-item"
            :class="{ active: activeTab === 'upcoming' }"
            @click="switchTab('upcoming')"
          >
            <text class="tab-text">即将出发</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 'completed' }"
            @click="switchTab('completed')"
          >
            <text class="tab-text">已完成</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: activeTab === 'cancelled' }"
            @click="switchTab('cancelled')"
          >
            <text class="tab-text">已取消</text>
          </view>
          <view class="tab-indicator" :style="{ left: tabIndicatorLeft }"></view>
        </view>

        <!-- 活动卡片列表 -->
        <view class="activity-list">
          <view
            class="activity-item"
            v-for="activity in filteredActivities"
            :key="activity._id"
            @click="goToDetail(activity._id)"
          >
            <image class="activity-cover" :src="activity.coverImage" mode="aspectFill" />
            <view class="activity-info">
              <text class="activity-title">{{ activity.title }}</text>
              <text class="activity-date">{{ activity.date }}</text>
              <view class="activity-bottom">
                <view
                  class="status-tag"
                  :class="activity.statusClass"
                >
                  <text class="status-text">{{ activity.statusText }}</text>
                </view>
                <text class="activity-price">¥{{ activity.price }}</text>
              </view>
            </view>
          </view>

          <!-- 空状态 -->
          <view class="empty-state" v-if="filteredActivities.length === 0">
            <text class="empty-text">暂无相关活动</text>
          </view>
        </view>
      </view>

      <!-- 我的游记模块 -->
      <view class="section-block">
        <view class="section-header">
          <text class="section-title">我的游记</text>
          <text class="section-more" @click="goToMyNotes">查看全部 ></text>
        </view>

        <view class="note-grid">
          <view
            class="note-card"
            v-for="note in myNotes"
            :key="note._id"
            @click="goToNote(note._id)"
          >
            <image class="note-cover" :src="note.coverImage" mode="aspectFill" />
            <view class="note-content">
              <text class="note-title">{{ note.title }}</text>
              <view class="note-meta">
                <text class="note-date">{{ note.date }}</text>
                <text class="note-views">{{ note.views }}浏览</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 管理员入口（仅管理员可见） -->
      <view class="section-block" v-if="isAdmin">
        <view class="admin-entry-card" @click="goToAdmin">
          <view class="admin-entry-left">
            <view class="admin-icon-wrap">
              <text class="admin-icon">⚙️</text>
            </view>
            <view class="admin-entry-info">
              <text class="admin-entry-title">管理中心</text>
              <text class="admin-entry-desc">发布活动、管理报名、查看数据</text>
            </view>
          </view>
          <text class="admin-entry-arrow">></text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="section-block">
        <view class="menu-card">
          <view class="menu-item" @click="contactService">
            <view class="menu-icon-wrap" style="background: #E3F2FD;">
              <text class="menu-emoji">📞</text>
            </view>
            <text class="menu-text">联系客服</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-divider"></view>
          <view class="menu-item" @click="showAbout">
            <view class="menu-icon-wrap" style="background: #FFF3E0;">
              <text class="menu-emoji">ℹ️</text>
            </view>
            <text class="menu-text">关于我们</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-divider"></view>
          <view class="menu-item" @click="handleLogout">
            <view class="menu-icon-wrap" style="background: #FFEBEE;">
              <text class="menu-emoji">🚪</text>
            </view>
            <text class="menu-text logout-text">退出登录</text>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view class="bottom-safe"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 状态栏高度
const statusBarHeight = ref(44)

// 当前Tab
const activeTab = ref('upcoming')

// Tab指示器位置
const tabIndicatorLeft = computed(() => {
  const tabs = ['upcoming', 'completed', 'cancelled']
  const index = tabs.indexOf(activeTab.value)
  return `calc(${index} * 33.33%)`
})

// 用户信息
const userInfo = ref({
  name: '张老师',
  department: '计算机学院',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  stats: {
    joinCount: 12,
    upcomingCount: 2,
    noteCount: 5
  }
})

// 我的活动数据
const myActivities = ref([
  {
    _id: 'a1',
    title: '黄山日出两日游',
    date: '2026年5月15日-16日',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    price: 299,
    status: 'upcoming',
    statusText: '即将出发',
    statusClass: 'status-upcoming'
  },
  {
    _id: 'a2',
    title: '武功山高山草甸徒步',
    date: '2026年5月20日-22日',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    price: 459,
    status: 'upcoming',
    statusText: '即将出发',
    statusClass: 'status-upcoming'
  },
  {
    _id: 'a3',
    title: '千岛湖环湖骑行',
    date: '2026年4月10日',
    coverImage: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop',
    price: 168,
    status: 'completed',
    statusText: '已完成',
    statusClass: 'status-completed'
  }
])

// 我的游记数据
const myNotes = ref([
  {
    _id: 'n1',
    title: '金秋十月，香山红叶漫山红遍',
    date: '2025.10.18',
    views: 326,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop'
  },
  {
    _id: 'n2',
    title: '古北水镇秋日漫步记录',
    date: '2025.09.22',
    views: 218,
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop'
  }
])

// 是否是管理员
const isAdmin = ref(true)

// 按Tab过滤活动
const filteredActivities = computed(() => {
  return myActivities.value.filter(a => a.status === activeTab.value)
})

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44
})

// 切换Tab
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// 跳转编辑资料
const goToEdit = () => {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

// 跳转我的活动
const goToMyActivities = (type: string) => {
  uni.navigateTo({ url: `/pages/profile/my-activities?type=${type}` })
}

// 跳转我的游记
const goToMyNotes = () => {
  uni.showToast({ title: '游记功能开发中', icon: 'none' })
}

// 跳转活动详情
const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/activity/detail?id=${id}` })
}

// 跳转游记详情
const goToNote = (id: string) => {
  uni.navigateTo({ url: `/pages/note/detail?id=${id}` })
}

// 联系客服
const contactService = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服微信：outdoor_service\n工作时间：周一至周五 9:00-18:00',
    showCancel: false,
    confirmText: '我知道了'
  })
}

// 关于我们
const showAbout = () => {
  uni.showModal({
    title: '关于户外探索',
    content: '版本: 1.0.0\n专为高校教职工打造的户外活动平台\n发现精彩旅程，遇见更好的自己',
    showCancel: false,
    confirmText: '我知道了'
  })
}

// 跳转管理中心
const goToAdmin = () => {
  uni.navigateTo({ url: '/pages/admin/index' })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/login/index' })
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* ========== 顶部用户卡片 ========== */
.user-card {
  background: linear-gradient(135deg, #4A6FA5 0%, #6B8CBB 100%);
  border-radius: 0 0 24px 24px;
}

.user-card-inner {
  padding: 50px 20px 24px;
}

.user-top {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #fff;
  margin-right: 14px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.user-department {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.edit-btn {
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.edit-btn-text {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
}

/* ========== 统计数据 ========== */
.user-stats {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px 0;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* ========== 主滚动区域 ========== */
.main-scroll {
  height: calc(100vh - 220px);
}

/* ========== 通用Section ========== */
.section-block {
  margin: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.section-more {
  font-size: 13px;
  color: #999;
}

/* ========== Tab切换 ========== */
.tab-bar {
  display: flex;
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  position: relative;
  z-index: 1;
}

.tab-text {
  font-size: 14px;
  color: #666;
  transition: color 0.3s;
}

.tab-item.active .tab-text {
  color: #4A6FA5;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: 33.33%;
  background: rgba(74, 111, 165, 0.08);
  border-radius: 10px;
  transition: left 0.3s ease;
}

/* ========== 活动卡片列表 ========== */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.activity-cover {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  flex-shrink: 0;
}

.activity-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activity-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-date {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.activity-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.status-tag {
  padding: 2px 10px;
  border-radius: 10px;
}

.status-upcoming {
  background: #E8F5E9;
}

.status-completed {
  background: #F5F5F5;
}

.status-cancelled {
  background: #FFEBEE;
}

.status-text {
  font-size: 11px;
  font-weight: 500;
}

.status-upcoming .status-text {
  color: #4CAF50;
}

.status-completed .status-text {
  color: #999;
}

.status-cancelled .status-text {
  color: #F44336;
}

.bottom-safe {
  height: 40px;
}

.activity-price {
  font-size: 15px;
  font-weight: 700;
  color: #FF6B00;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #ccc;
}

/* ========== 我的游记网格 ========== */
.note-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.note-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.note-cover {
  width: 100%;
  height: 120px;
}

.note-content {
  padding: 10px;
}

.note-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}

.note-date {
  font-size: 11px;
  color: #999;
}

.note-views {
  font-size: 11px;
  color: #999;
}

/* ========== 管理员入口 ========== */
.admin-entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.admin-entry-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-icon-wrap {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-icon {
  font-size: 22px;
}

.admin-entry-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-entry-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.admin-entry-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.admin-entry-arrow {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
}

/* ========== 功能菜单 ========== */
.menu-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
}

.menu-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-emoji {
  font-size: 18px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.logout-text {
  color: #F44336;
}

.menu-arrow {
  font-size: 14px;
  color: #ccc;
}

.menu-divider {
  height: 1px;
  background: #f5f5f5;
  margin-left: 64px;
}
</style>
