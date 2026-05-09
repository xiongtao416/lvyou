<template>
  <view class="past-card" @click="handleClick">
    <image class="card-image" :src="activity.coverImage" mode="aspectFill" />
    <view class="card-content">
      <text class="card-title">{{ activity.title }}</text>
      <text class="card-date">{{ formatDate }}</text>
      <view class="photo-preview" v-if="activity.photos && activity.photos.length > 0">
        <image 
          v-for="(photo, index) in activity.photos.slice(0, 3)" 
          :key="index"
          class="preview-img" 
          :src="photo" 
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
  activity: {
    _id: string
    title: string
    coverImage: string
    activityDate: string
    photos?: string[]
    noteId: string
  }
}>()

const emit = defineEmits<{
  (e: 'click', noteId: string): void
}>()

const formatDate = computed(() => {
  return formatDateUtil(props.activity.activityDate, 'YYYY.MM.DD')
})

const handleClick = () => {
  emit('click', props.activity.noteId)
}
</script>

<style lang="scss" scoped>
.past-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 120px;
}

.card-content {
  padding: 10px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
  display: block;
}

.photo-preview {
  display: flex;
  gap: 4px;
}

.preview-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
</style>
