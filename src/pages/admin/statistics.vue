<template>
  <view class="statistics-page">
    <!-- 概览卡片 -->
    <view class="overview-section">
      <view class="overview-card">
        <view class="overview-header">
          <text class="overview-title">数据概览</text>
          <text class="overview-period">近30天</text>
        </view>
        <view class="overview-stats">
          <view class="stat-item">
            <text class="stat-num">{{ overview.activities }}</text>
            <text class="stat-label">发布活动</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ overview.participants }}</text>
            <text class="stat-label">累计报名</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ overview.views }}</text>
            <text class="stat-label">总浏览</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">¥{{ overview.revenue }}</text>
            <text class="stat-label">总收入</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动排行 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">热门活动 TOP5</text>
      </view>
      <view class="ranking-list">
        <view class="ranking-item" v-for="(item, index) in activityRanking" :key="index">
          <view class="ranking-num" :class="{ top: index < 3 }">{{ index + 1 }}</view>
          <image class="ranking-cover" :src="item.cover" mode="aspectFill" />
          <view class="ranking-info">
            <text class="ranking-title">{{ item.title }}</text>
            <text class="ranking-meta">{{ item.participants }}人报名 · {{ item.views }}浏览</text>
          </view>
          <text class="ranking-price">¥{{ item.price }}</text>
        </view>
      </view>
    </view>

    <!-- 报名趋势 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">报名趋势</text>
        <view class="period-tabs">
          <text class="period-tab" :class="{ active: period === '7' }" @click="period = '7'">近7天</text>
          <text class="period-tab" :class="{ active: period === '30' }" @click="period = '30'">近30天</text>
        </view>
      </view>
      <view class="trend-chart">
        <view class="chart-bars">
          <view class="chart-bar-item" v-for="(item, index) in trendData" :key="index">
            <view class="chart-bar" :style="{ height: (item.value / maxValue * 100) + '%' }"></view>
            <text class="chart-label">{{ item.label }}</text>
          </view>
        </view>
      </view>
      <view class="trend-summary">
        <view class="summary-item">
          <text class="summary-num">{{ trendTotal }}</text>
          <text class="summary-label">{{ period === '7' ? '近7天' : '近30天' }}报名总计</text>
        </view>
        <view class="summary-item">
          <text class="summary-num up">↑ {{ trendGrowth }}%</text>
          <text class="summary-label">较上期</text>
        </view>
      </view>
    </view>

    <!-- 用户数据 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">用户数据</text>
      </view>
      <view class="user-stats">
        <view class="user-stat-item">
          <text class="user-stat-num">{{ userStats.total }}</text>
          <text class="user-stat-label">总用户数</text>
        </view>
        <view class="user-stat-item">
          <text class="user-stat-num">{{ userStats.newToday }}</text>
          <text class="user-stat-label">今日新增</text>
        </view>
        <view class="user-stat-item">
          <text class="user-stat-num">{{ userStats.active }}</text>
          <text class="user-stat-label">活跃用户</text>
        </view>
      </view>
    </view>

    <view style="height: 20px;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const period = ref('7')

const overview = ref({
  activities: 12,
  participants: 328,
  views: 8960,
  revenue: 58400
})

const activityRanking = ref([
  { title: '黄山日出两日游', cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop', participants: 86, views: 2340, price: 299 },
  { title: '武功山徒步穿越', cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=100&fit=crop', participants: 72, views: 1890, price: 388 },
  { title: '九华山祈福一日', cover: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=100&h=100&fit=crop', participants: 58, views: 1560, price: 168 },
  { title: '莫干山露营之夜', cover: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=100&h=100&fit=crop', participants: 45, views: 1230, price: 458 },
  { title: '崇礼滑雪一日', cover: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop', participants: 38, views: 980, price: 288 }
])

const trendData = computed(() => {
  if (period.value === '7') {
    return [
      { label: '周一', value: 28 }, { label: '周二', value: 35 },
      { label: '周三', value: 42 }, { label: '周四', value: 38 },
      { label: '周五', value: 55 }, { label: '周六', value: 72 },
      { label: '周日', value: 68 }
    ]
  }
  return [
    { label: '1日', value: 25 }, { label: '5日', value: 38 },
    { label: '10日', value: 42 }, { label: '15日', value: 55 },
    { label: '20日', value: 48 }, { label: '25日', value: 62 },
    { label: '30日', value: 72 }
  ]
})

const maxValue = computed(() => Math.max(...trendData.value.map(i => i.value)))
const trendTotal = computed(() => trendData.value.reduce((sum, i) => sum + i.value, 0))
const trendGrowth = ref(18)

const userStats = ref({
  total: 1256,
  newToday: 23,
  active: 458
})
</script>

<style lang="scss" scoped>
.statistics-page { min-height: 100vh; background: #f5f5f5; padding: 12px 16px; }

.overview-section { margin-bottom: 12px; }
.overview-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 20px; color: #fff; }
.overview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.overview-title { font-size: 16px; font-weight: 600; }
.overview-period { font-size: 12px; opacity: 0.8; }
.overview-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-item { text-align: center; }
.stat-num { display: block; font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.stat-label { font-size: 11px; opacity: 0.85; }

.section-card { background: #fff; border-radius: 16px; padding: 16px; margin-bottom: 12px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title { font-size: 16px; font-weight: 600; color: #333; }
.period-tabs { display: flex; gap: 8px; }
.period-tab { font-size: 12px; color: #999; padding: 4px 10px; border-radius: 12px; background: #f5f5f5; &.active { background: #FFD000; color: #333; } }

.ranking-list { display: flex; flex-direction: column; gap: 12px; }
.ranking-item { display: flex; align-items: center; gap: 12px; }
.ranking-num { width: 20px; height: 20px; border-radius: 50%; background: #f0f0f0; color: #999; font-size: 12px; display: flex; align-items: center; justify-content: center; &.top { background: #FFD000; color: #333; font-weight: 600; } }
.ranking-cover { width: 48px; height: 48px; border-radius: 8px; }
.ranking-info { flex: 1; }
.ranking-title { display: block; font-size: 14px; color: #333; margin-bottom: 4px; }
.ranking-meta { font-size: 12px; color: #999; }
.ranking-price { font-size: 14px; color: #FF6B00; font-weight: 600; }

.trend-chart { margin-bottom: 16px; }
.chart-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 80px; padding: 0 8px; }
.chart-bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.chart-bar { width: 20px; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0; min-height: 4px; margin-top: auto; }
.chart-label { font-size: 10px; color: #999; margin-top: 6px; }

.trend-summary { display: flex; justify-content: space-around; padding-top: 12px; border-top: 1px solid #f0f0f0; }
.summary-item { text-align: center; }
.summary-num { display: block; font-size: 20px; font-weight: 700; color: #333; margin-bottom: 4px; &.up { color: #52C41A; } }
.summary-label { font-size: 12px; color: #999; }

.user-stats { display: flex; justify-content: space-around; }
.user-stat-item { text-align: center; }
.user-stat-num { display: block; font-size: 24px; font-weight: 700; color: #333; margin-bottom: 4px; }
.user-stat-label { font-size: 12px; color: #999; }
</style>
