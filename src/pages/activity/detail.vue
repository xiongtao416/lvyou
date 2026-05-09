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
          <text class="info-value">{{ formatDateShort(activity.startDate) }}</text>
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
import { activityApi } from '@/utils/http'
import { formatDateShort } from '@/utils/format'
import type { Activity, TimelineItem } from '@/types'

const statusBarHeight = ref(44)
const tabs = ['图文', '行程', '费用', '须知']
const currentTab = ref(0)
const showFloatingTab = ref(false)
const scrollToView = ref('')
const isFavorite = ref(false)
const loading = ref(false)

// 各区块的顶部位置（动态计算）
const sectionTops = ref<number[]>([0, 0, 0, 0])
const tabNavHeight = 100 // Tab导航高度 + 安全距离

const activity = ref<Partial<Activity>>({})
const timelineItems = ref<TimelineItem[]>([])

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44

  // 获取路由参数 id
  const id = getRouteParam('id')
  
  // 从 API 加载活动详情
  loadActivityDetail(id)
})

// 加载活动详情
const loadActivityDetail = async (id: string) => {
  if (!id) {
    uni.showToast({ title: '活动ID不存在', icon: 'none' })
    return
  }
  
  loading.value = true
  try {
    const res: any = await activityApi.getById(id)
    activity.value = res
    
    // 转换行程数据为时间轴格式
    if (res.itinerary && res.itinerary.length > 0) {
      timelineItems.value = convertItineraryToTimeline(res.itinerary)
    }
    
    // 延迟计算各区块位置
    nextTick(() => {
      setTimeout(() => {
        calculateSectionPositions()
      }, 300)
    })
  } catch (error) {
    console.error('加载活动详情失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 将行程数据转换为时间轴格式
const convertItineraryToTimeline = (itinerary: any[]): TimelineItem[] => {
  const items: TimelineItem[] = []
  
  itinerary.forEach((day: any, dayIndex: number) => {
    if (day.schedule && day.schedule.length > 0) {
      day.schedule.forEach((schedule: any, scheduleIndex: number) => {
        items.push({
          timeRange: schedule.time || '--:--',
          title: schedule.content || '',
          desc: scheduleIndex === 0 ? '第' + (dayIndex + 1) + '天: ' + day.title : '',
          image: schedule.image || '',
          tags: scheduleIndex === 0 ? ['行程'] : [],
          isHighlight: scheduleIndex === 0
        })
      })
    }
  })
  
  return items
}

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

// 图片加载失败处理
const onImageError = (e: any) => {
  // 使用默认占位图
  const defaultImage = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'
  // 如果原图加载失败，替换为默认图
  if (e && e.currentTarget) {
    e.currentTarget.src = defaultImage
  }
}

const goBack = () => { uni.navigateBack() }
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({ title: isFavorite.value ? '已收藏' : '已取消收藏', icon: 'none' })
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
const handleJoin = () => { uni.navigateTo({ url: '/pages/activity/register?id=' + (activity.value.id || '') }) }
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
