<template>
  <view class="activity-card">
    <!-- 头部信息 -->
    <view class="card-header">
      <view class="title-row">
        <text class="status-badge">{{ statusText }}</text>
        <text class="activity-title">{{ formatTitle }}</text>
      </view>
      <view class="meta-row">
        <view class="meta-item">
          <text class="iconfont icon-time"></text>
          <text>{{ formatDateTime }}</text>
        </view>
        <view class="meta-item">
          <text class="iconfont icon-location"></text>
          <text>{{ activity.location }}</text>
        </view>
      </view>
    </view>

    <!-- 图片网格 -->
    <view class="image-grid" v-if="activity.images && activity.images.length > 0">
      <image 
        class="grid-main" 
        :src="activity.images[0]" 
        mode="aspectFill"
      />
      <view class="grid-side" v-if="activity.images.length > 1">
        <image 
          v-for="(img, index) in activity.images.slice(1, 3)" 
          :key="index"
          class="grid-sub" 
          :src="img" 
          mode="aspectFill"
        />
      </view>
    </view>

    <!-- 底部参与信息 -->
    <view class="card-footer">
      <view class="participants">
        <view class="avatar-list">
          <image 
            v-for="(user, index) in displayParticipants" 
            :key="index"
            class="avatar" 
            :src="user.avatar"
            mode="aspectFill"
          />
        </view>
        <text class="participant-count">{{ activity.participantCount || 0 }}人已上车</text>
      </view>
      <button class="join-btn" @click.stop="handleJoin">上车</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, getWeekDay, getActivityStatusText } from '@/utils/format'

const props = defineProps<{
  activity: {
    _id: string
    title: string
    startDate: string
    startTime?: string
    location: string
    status: string
    images?: string[]
    participantCount?: number
    participants?: Array<{ avatar: string; name: string }>
    maxParticipants?: number
  }
}>()

const emit = defineEmits<{
  (e: 'join', activity: any): void
}>()

// 状态文本
const statusText = computed(() => getActivityStatusText(props.activity.status))

// 格式化标题（添加日期前缀）
const formatTitle = computed(() => {
  const date = new Date(props.activity.startDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = getWeekDay(date)
  return `${month}/${day}${weekDay} ${props.activity.title}`
})

// 格式化日期时间
const formatDateTime = computed(() => {
  const date = formatDate(props.activity.startDate, 'MM.DD')
  const weekDay = getWeekDay(props.activity.startDate)
  const time = props.activity.startTime || '08:00'
  return `${weekDay} ${date} ${time}`
})

// 显示的参与者（最多3个）
const displayParticipants = computed(() => {
  const list = props.activity.participants || []
  return list.slice(0, 3)
})

// 处理报名
const handleJoin = () => {
  emit('join', props.activity)
}
</script>

<style lang="scss" scoped>
.activity-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  padding: 12px 12px 8px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.status-badge {
  background: #52C41A;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.activity-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  flex: 1;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.image-grid {
  display: flex;
  gap: 2px;
  padding: 0 12px;
  height: 202px;
}

.grid-main {
  flex: 2;
  height: 100%;
  border-radius: 8px 0 0 8px;
}

.grid-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.grid-sub {
  flex: 1;
  width: 100%;
}

.grid-sub:first-child {
  border-radius: 0 8px 0 0;
}

.grid-sub:last-child {
  border-radius: 0 0 8px 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

.participants {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-list {
  display: flex;
  align-items: center;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.participant-count {
  font-size: 13px;
  color: #666;
}

.join-btn {
  background: #333;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 24px;
  border-radius: 20px;
  border: none;
  line-height: 1;
}

.join-btn:active {
  opacity: 0.8;
}
</style>
