<template>
  <view class="my-activities-page">
    <!-- Tab切换 -->
    <view class="tab-bar">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="switchTab(index)"
      >
        {{ tab }}
        <view class="tab-indicator" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 活动列表 -->
    <scroll-view scroll-y class="activity-list">
      <!-- 即将出发 -->
      <view v-if="currentTab === 0">
        <view
          class="activity-card"
          v-for="(item, index) in upcomingList"
          :key="index"
          @click="goDetail(item.id)"
        >
          <image class="card-cover" :src="item.coverImage" mode="aspectFill" />
          <view class="card-info">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-meta">
              <text class="meta-date">{{ item.date }}</text>
              <text class="meta-location">{{ item.location }}</text>
            </view>
            <view class="card-bottom">
              <view class="status-tag" :class="item.statusClass">{{ item.statusText }}</view>
              <text class="card-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="upcomingList.length === 0">
          <text class="empty-icon">📋</text>
          <text class="empty-text">暂无活动</text>
          <text class="empty-desc">快去发现感兴趣的户外活动吧</text>
        </view>
      </view>

      <!-- 已完成 -->
      <view v-if="currentTab === 1">
        <view
          class="activity-card"
          v-for="(item, index) in completedList"
          :key="index"
          @click="goDetail(item.id)"
        >
          <image class="card-cover" :src="item.coverImage" mode="aspectFill" />
          <view class="card-info">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-meta">
              <text class="meta-date">{{ item.date }}</text>
              <text class="meta-location">{{ item.location }}</text>
            </view>
            <view class="card-bottom">
              <view class="status-tag completed">已完成</view>
              <text class="card-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>

        <view class="empty-state" v-if="completedList.length === 0">
          <text class="empty-icon">📋</text>
          <text class="empty-text">暂无活动</text>
          <text class="empty-desc">快去发现感兴趣的户外活动吧</text>
        </view>
      </view>

      <!-- 已取消 -->
      <view v-if="currentTab === 2">
        <view
          class="activity-card"
          v-for="(item, index) in cancelledList"
          :key="index"
          @click="goDetail(item.id)"
        >
          <image class="card-cover" :src="item.coverImage" mode="aspectFill" />
          <view class="card-info">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-meta">
              <text class="meta-date">{{ item.date }}</text>
              <text class="meta-location">{{ item.location }}</text>
            </view>
            <view class="card-bottom">
              <view class="status-tag cancelled">已取消</view>
              <text class="card-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>

        <view class="empty-state" v-if="cancelledList.length === 0">
          <text class="empty-icon">📋</text>
          <text class="empty-text">暂无活动</text>
          <text class="empty-desc">快去发现感兴趣的户外活动吧</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { activityApi } from '@/utils/http'
import { formatDate } from '@/utils/format'

const currentTab = ref(0)
const tabs = ['即将出发', '已完成', '已取消']
const loading = ref(false)

// 活动数据从API加载
const allActivities = ref<any[]>([])

const upcomingList = computed(() => allActivities.value.filter(a => a.status === 'registering' || a.status === 'upcoming'))
const completedList = computed(() => allActivities.value.filter(a => a.status === 'completed'))
const cancelledList = computed(() => allActivities.value.filter(a => a.status === 'cancelled'))

// 加载活动列表
const loadActivities = async () => {
  loading.value = true
  try {
    const res: any = await activityApi.getList({ pageSize: 20 })
    const list = res?.list || (Array.isArray(res) ? res : [])
    allActivities.value = list.map((a: any) => ({
      id: a.id,
      title: a.title,
      date: formatDate(a.startDate),
      location: a.location,
      price: a.price,
      statusText: a.statusText || a.status === 'registering' ? '即将出发' : a.status === 'completed' ? '已完成' : '已取消',
      statusClass: a.status === 'registering' ? 'upcoming' : a.status,
      coverImage: a.cover || (a.images && a.images[0]) || ''
    }))
  } catch (error) {
    console.error('加载活动失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换Tab
const switchTab = (index: number) => {
  currentTab.value = index
}

onMounted(() => {
  loadActivities()
})

// 跳转详情
const goDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/activity/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.my-activities-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 15px;
  color: #999;
  position: relative;
  transition: color 0.2s;

  &.active {
    color: #333;
    font-weight: 600;
  }
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #FFD000;
  border-radius: 2px;
}

.activity-list {
  height: calc(100vh - 44px);
  padding: 12px 15px;
}

.activity-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.card-cover {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  margin-right: 12px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.meta-date,
.meta-location {
  font-size: 12px;
  color: #999;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;

  &.upcoming {
    background: #FFF8E1;
    color: #FF8F00;
  }

  &.registering {
    background: #E8F5E9;
    color: #43A047;
  }

  &.completed {
    background: #f0f0f0;
    color: #999;
  }

  &.cancelled {
    background: #FFF0F0;
    color: #FF6B6B;
  }
}

.card-price {
  font-size: 16px;
  font-weight: 700;
  color: #FF6B00;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 15px;
  color: #999;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 13px;
  color: #ccc;
}
</style>
