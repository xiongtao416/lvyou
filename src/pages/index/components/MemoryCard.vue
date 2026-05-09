<template>
  <view class="memory-card" @click="handleClick">
    <view class="card-inner">
      <view class="main-image-wrapper">
        <image class="main-image" :src="note.coverImage" mode="aspectFill" />
        <view class="image-overlay">
          <view class="overlay-content">
            <text class="note-title">{{ note.title }}</text>
            <view class="author-info">
              <image class="author-avatar" :src="note.author.avatar" mode="aspectFill" />
              <text class="author-name">{{ note.author.name }}</text>
              <text class="participant-info">· {{ note.participantCount }}人参与</text>
            </view>
          </view>
        </view>
        <view class="completed-badge">
          <text>{{ formatDate }} 已完成</text>
        </view>
      </view>
      <view class="side-images" v-if="note.images && note.images.length > 0">
        <image 
          v-for="(img, index) in note.images.slice(0, 4)" 
          :key="index"
          class="side-image" 
          :src="img" 
          mode="aspectFill"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate as formatDateUtil } from '@/utils/format'

const props = defineProps<{
  note: {
    _id: string
    title: string
    coverImage: string
    images?: string[]
    author: {
      name: string
      avatar: string
    }
    participantCount: number
    activityDate: string
  }
}>()

const emit = defineEmits<{
  (e: 'click', id: string): void
}>()

const formatDate = computed(() => {
  return formatDateUtil(props.note.activityDate, 'YYYY.MM.DD')
})

const handleClick = () => {
  emit('click', props.note._id)
}
</script>

<style lang="scss" scoped>
.memory-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.card-inner {
  display: flex;
  height: 180px;
}

.main-image-wrapper {
  flex: 1;
  position: relative;
}

.main-image {
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 12px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.author-info {
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
  color: rgba(255, 255, 255, 0.9);
}

.participant-info {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.completed-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 10px;
  border-radius: 12px;
}

.completed-badge text {
  font-size: 11px;
  color: #fff;
}

.side-images {
  width: 72px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #f0f0f0;
}

.side-image {
  flex: 1;
  width: 100%;
}
</style>
