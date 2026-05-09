<template>
  <view class="registrations-page">
    <!-- 活动选择 -->
    <view class="activity-selector">
      <scroll-view scroll-x class="activity-scroll">
        <view class="activity-list">
          <view 
            class="activity-item" 
            :class="{ active: selectedActivity === 'all' }"
            @click="selectActivity('all')"
          >
            <text class="activity-name">全部活动</text>
            <text class="activity-count">{{ totalCount }}</text>
          </view>
          <view 
            v-for="activity in myActivities" 
            :key="activity._id"
            class="activity-item"
            :class="{ active: selectedActivity === activity._id }"
            @click="selectActivity(activity._id)"
          >
            <text class="activity-name">{{ activity.title }}</text>
            <text class="activity-count">{{ activity.registrationCount }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-row">
      <view class="stat-card">
        <text class="stat-number">{{ stats.pending }}</text>
        <text class="stat-label">待确认</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ stats.confirmed }}</text>
        <text class="stat-label">已确认</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ stats.cancelled }}</text>
        <text class="stat-label">已取消</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">¥{{ stats.totalAmount }}</text>
        <text class="stat-label">总金额</text>
      </view>
    </view>

    <!-- 报名列表 -->
    <scroll-view scroll-y class="registration-list">
      <view class="list-header">
        <text class="header-title">报名人员</text>
        <view class="filter-tabs">
          <text 
            class="tab-item" 
            :class="{ active: filterStatus === 'all' }"
            @click="filterStatus = 'all'"
          >全部</text>
          <text 
            class="tab-item" 
            :class="{ active: filterStatus === 'pending' }"
            @click="filterStatus = 'pending'"
          >待确认</text>
          <text 
            class="tab-item" 
            :class="{ active: filterStatus === 'confirmed' }"
            @click="filterStatus = 'confirmed'"
          >已确认</text>
        </view>
      </view>

      <view class="registration-item" v-for="(item, index) in filteredRegistrations" :key="index">
        <view class="user-info">
          <image class="user-avatar" :src="item.avatar" mode="aspectFill" />
          <view class="user-detail">
            <text class="user-name">{{ item.name }}</text>
            <text class="user-phone">{{ item.phone }}</text>
            <view class="user-tags">
              <text class="tag" v-if="item.department">{{ item.department }}</text>
              <text class="tag people">{{ item.count }}人</text>
            </view>
          </view>
        </view>
        <view class="registration-info">
          <text class="reg-activity">{{ item.activityTitle }}</text>
          <text class="reg-time">{{ item.registerTime }}</text>
          <view class="reg-footer">
            <text class="reg-price">¥{{ item.totalPrice }}</text>
            <view class="status-badge" :class="item.status">
              {{ statusText[item.status] }}
            </view>
          </view>
        </view>
        <view class="action-btns" v-if="item.status === 'pending'">
          <button class="btn-confirm" @click="confirmRegistration(item)">确认</button>
          <button class="btn-reject" @click="rejectRegistration(item)">拒绝</button>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredRegistrations.length === 0">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无报名数据</text>
      </view>
    </scroll-view>

    <!-- 导出按钮 -->
    <view class="bottom-bar">
      <button class="export-btn" @click="exportData">
        <text class="btn-icon">📥</text>
        <text>导出报名名单</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { registrationApi, activityApi } from '@/utils/http'

const selectedActivity = ref('all')
const filterStatus = ref('all')

const statusText: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  cancelled: '已取消',
  refunded: '已退款'
}

const stats = computed(() => {
  const list = registrations.value
  return {
    pending: list.filter(r => r.status === 'pending').length,
    confirmed: list.filter(r => r.status === 'confirmed').length,
    cancelled: list.filter(r => r.status === 'cancelled').length,
    totalAmount: list.reduce((sum, r) => sum + r.totalPrice, 0)
  }
})

const totalCount = computed(() => stats.pending + stats.confirmed + stats.cancelled)

const myActivities = ref<any[]>([])

const registrations = ref<any[]>([])

const loadMyActivities = async () => {
  try {
    const res: any = await activityApi.getList()
    if (res) {
      myActivities.value = Array.isArray(res) ? res : (res.list || [])
    }
  } catch (e) {
    console.error('获取活动列表失败', e)
  }
}

const loadRegistrations = async () => {
  try {
    const res: any = await registrationApi.getList()
    if (res) {
      registrations.value = Array.isArray(res) ? res : (res.list || [])
    }
  } catch (e) {
    console.error('获取报名列表失败', e)
  }
}

onMounted(() => {
  loadMyActivities()
  loadRegistrations()
})

const filteredRegistrations = computed(() => {
  let result = registrations.value
  if (selectedActivity.value !== 'all') {
    result = result.filter(item => item.activityId === selectedActivity.value)
  }
  if (filterStatus.value !== 'all') {
    result = result.filter(item => item.status === filterStatus.value)
  }
  return result
})

const selectActivity = (id: string) => {
  selectedActivity.value = id
}

// 确认报名
const confirmRegistration = (item: any) => {
  uni.showModal({
    title: '确认报名',
    content: `确认 ${item.name} 的报名吗？`,
    success: (res) => {
      if (res.confirm) {
        item.status = 'confirmed'
        uni.showToast({ title: '已确认', icon: 'success' })
      }
    }
  })
}

const rejectRegistration = (item: any) => {
  uni.showModal({
    title: '拒绝报名',
    content: `确定要拒绝 ${item.name} 的报名吗？`,
    confirmColor: '#FF4444',
    success: (res) => {
      if (res.confirm) {
        item.status = 'cancelled'
        uni.showToast({ title: '已拒绝', icon: 'none' })
      }
    }
  })
}

const exportData = () => {
  uni.showLoading({ title: '生成中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '导出成功', icon: 'success' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.registrations-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.activity-selector {
  background: #fff;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-scroll {
  white-space: nowrap;
}

.activity-list {
  display: inline-flex;
  padding: 0 16px;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  
  &.active {
    background: #FFD000;
  }
}

.activity-name {
  font-size: 13px;
  color: #333;
}

.activity-count {
  font-size: 11px;
  color: #666;
  background: rgba(0,0,0,0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.stats-row {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.registration-list {
  height: calc(100vh - 280px);
  background: #fff;
  margin: 0 16px;
  border-radius: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.filter-tabs {
  display: flex;
  gap: 12px;
}

.tab-item {
  font-size: 13px;
  color: #999;
  padding: 4px 0;
  position: relative;
  
  &.active {
    color: #FFD000;
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #FFD000;
      border-radius: 1px;
    }
  }
}

.registration-item {
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.user-info {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.user-detail {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  display: block;
}

.user-tags {
  display: flex;
  gap: 6px;
}

.tag {
  font-size: 11px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  
  &.people {
    background: #E3F2FD;
    color: #1976D2;
  }
}

.registration-info {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.reg-activity {
  display: block;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.reg-time {
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
  display: block;
}

.reg-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reg-price {
  font-size: 16px;
  font-weight: 700;
  color: #FF6B00;
}

.status-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  
  &.pending {
    background: #FFF3E0;
    color: #F57C00;
  }
  
  &.confirmed {
    background: #E8F5E9;
    color: #388E3C;
  }
  
  &.cancelled {
    background: #FFEBEE;
    color: #D32F2F;
  }
}

.action-btns {
  display: flex;
  gap: 10px;
}

.btn-confirm {
  flex: 1;
  height: 36px;
  background: #4CAF50;
  color: #fff;
  font-size: 13px;
  border-radius: 18px;
  border: none;
}

.btn-reject {
  flex: 1;
  height: 36px;
  background: #fff;
  color: #FF4444;
  font-size: 13px;
  border-radius: 18px;
  border: 1px solid #FF4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.export-btn {
  width: 100%;
  height: 46px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 15px;
  border-radius: 23px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  font-size: 18px;
}
</style>
