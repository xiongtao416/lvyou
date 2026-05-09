<template>
  <view class="admin-page">
    <!-- 管理员信息卡片 -->
    <view class="admin-card">
      <view class="admin-header">
        <image class="admin-avatar" :src="adminInfo.avatar" mode="aspectFill" />
        <view class="admin-info">
          <text class="admin-name">{{ adminInfo.name }}</text>
          <text class="admin-role">{{ adminInfo.role }}</text>
        </view>
      </view>
      <view class="admin-stats">
        <view class="stat-item">
          <text class="stat-num">{{ stats.published }}</text>
          <text class="stat-label">发布活动</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.participants }}</text>
          <text class="stat-label">累计报名</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.views }}</text>
          <text class="stat-label">总浏览量</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <text class="section-title">活动管理</text>
      <view class="menu-grid">
        <view class="menu-item" @click="goToPublish">
          <view class="menu-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <text class="icon-text">📅</text>
          </view>
          <text class="menu-label">发布活动</text>
          <text class="menu-desc">创建新的户外活动</text>
        </view>
        <view class="menu-item" @click="goToRegistrationManage">
          <view class="menu-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <text class="icon-text">👥</text>
          </view>
          <text class="menu-label">报名管理</text>
          <text class="menu-desc">查看和处理报名</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <text class="section-title">数据与内容</text>
      <view class="menu-grid">
        <view class="menu-item" @click="goToStatistics">
          <view class="menu-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <text class="icon-text">📊</text>
          </view>
          <text class="menu-label">数据统计</text>
          <text class="menu-desc">活动数据分析</text>
        </view>
        <view class="menu-item" @click="goToContentManage">
          <view class="menu-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <text class="icon-text">📝</text>
          </view>
          <text class="menu-label">内容管理</text>
          <text class="menu-desc">游记和评论审核</text>
        </view>
      </view>
    </view>

    <!-- 权限管理（仅超级管理员可见） -->
    <view class="menu-section" v-if="adminInfo.isSuperAdmin">
      <text class="section-title">系统管理</text>
      <view class="menu-list">
        <view class="list-item" @click="goToUserManage">
          <view class="list-icon-wrap" style="background: #FFF3E0;">
            <text class="list-emoji">🔐</text>
          </view>
          <text class="list-label">权限管理</text>
          <text class="list-arrow">›</text>
        </view>
        <view class="list-item" @click="goToSettings">
          <view class="list-icon-wrap" style="background: #E8EAF6;">
            <text class="list-emoji">⚙️</text>
          </view>
          <text class="list-label">系统设置</text>
          <text class="list-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const adminInfo = ref({
  name: '张老师',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  role: '活动组织者',
  isSuperAdmin: true
})

const stats = ref({
  published: 12,
  participants: 156,
  views: 3280
})

const goToPublish = () => {
  uni.navigateTo({ url: '/pages/admin/publish' })
}

const goToRegistrationManage = () => {
  uni.navigateTo({ url: '/pages/admin/registrations' })
}

const goToStatistics = () => {
  uni.navigateTo({ url: '/pages/admin/statistics' })
}

const goToContentManage = () => {
  uni.navigateTo({ url: '/pages/admin/content' })
}

const goToUserManage = () => {
  uni.navigateTo({ url: '/pages/admin/users' })
}

const goToSettings = () => {
  uni.showToast({ title: '系统设置开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 30px;
}

.admin-card {
  margin: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px 20px 20px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
}

.admin-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.admin-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.4);
  margin-right: 14px;
}

.admin-info {
  flex: 1;
}

.admin-name {
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.admin-role {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.15);
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
}

.admin-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-num {
  display: block;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.15);
}

.menu-section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 14px;
  display: block;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.menu-item {
  background: #f8f8f8;
  border-radius: 14px;
  padding: 18px 12px;
  text-align: center;
  transition: transform 0.2s;
}

.menu-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.icon-text {
  font-size: 24px;
}

.menu-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.menu-desc {
  font-size: 11px;
  color: #999;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 14px 4px;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
  }
}

.list-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.list-emoji {
  font-size: 18px;
}

.list-label {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.list-arrow {
  font-size: 18px;
  color: #ccc;
  font-weight: 300;
}
</style>
