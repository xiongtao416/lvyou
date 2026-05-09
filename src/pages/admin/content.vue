<template>
  <view class="content-page">
    <!-- Tab切换 -->
    <view class="tab-bar">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        {{ tab }}
        <view class="tab-badge" v-if="index === 0 && pendingNotes > 0">{{ pendingNotes }}</view>
        <view class="tab-badge" v-if="index === 1 && pendingComments > 0">{{ pendingComments }}</view>
      </view>
    </view>

    <!-- 游记管理 -->
    <view v-if="currentTab === 0" class="content-list">
      <view class="list-header">
        <text class="list-count">共 {{ notes.length }} 篇游记</text>
      </view>
      <view class="note-item" v-for="(note, index) in notes" :key="index">
        <view class="note-main">
          <image class="note-cover" :src="note.cover" mode="aspectFill" />
          <view class="note-info">
            <text class="note-title">{{ note.title }}</text>
            <view class="note-meta">
              <image class="author-avatar" :src="note.authorAvatar" />
              <text class="author-name">{{ note.authorName }}</text>
              <text class="note-date">{{ note.date }}</text>
            </view>
            <view class="note-stats">
              <text class="stat">👁 {{ note.views }}</text>
              <text class="stat">❤ {{ note.likes }}</text>
              <text class="stat">💬 {{ note.comments }}</text>
            </view>
          </view>
          <view class="note-status" :class="note.statusClass">{{ note.statusText }}</view>
        </view>
        <view class="note-actions" v-if="note.status === 'pending'">
          <view class="action-btn" @click="approveNote(note)">
            <text class="btn-icon">✓</text>
            <text>通过</text>
          </view>
          <view class="action-btn" @click="rejectNote(note)">
            <text class="btn-icon danger">✗</text>
            <text class="danger">拒绝</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 评论管理 -->
    <view v-if="currentTab === 1" class="content-list">
      <view class="list-header">
        <text class="list-count">共 {{ comments.length }} 条评论</text>
      </view>
      <view class="comment-item" v-for="(comment, index) in comments" :key="index">
        <view class="comment-header">
          <image class="comment-avatar" :src="comment.avatar" />
          <view class="comment-user">
            <text class="user-name">{{ comment.userName }}</text>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
          <view class="comment-status" :class="comment.statusClass">{{ comment.statusText }}</view>
        </view>
        <text class="comment-content">{{ comment.content }}</text>
        <view class="comment-footer">
          <text class="related-to">关联：{{ comment.relatedTitle }}</text>
        </view>
        <view class="comment-actions">
          <view class="action-btn" @click="handleAction(comment, 'approve')" v-if="comment.status === 'pending'">
            <text class="btn-icon">✓</text>
            <text>通过</text>
          </view>
          <view class="action-btn" @click="handleAction(comment, 'reject')" v-if="comment.status === 'pending'">
            <text class="btn-icon">✗</text>
            <text>删除</text>
          </view>
          <view class="action-btn" @click="handleAction(comment, 'delete')" v-if="comment.status === 'approved'">
            <text class="btn-icon danger">🗑</text>
            <text class="danger">删除</text>
          </view>
        </view>
      </view>
    </view>

    <view style="height: 20px;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { noteApi } from '@/utils/http'

const currentTab = ref(0)
const tabs = ['游记审核', '评论管理']
const pendingNotes = ref(0)
const pendingComments = ref(5)

const notes = ref<any[]>([])

const loadNotes = async () => {
  try {
    const res: any = await noteApi.getList()
    if (res) {
      const list = Array.isArray(res) ? res : (res.list || [])
      notes.value = list
      pendingNotes.value = list.filter((n: any) => n.status === 'pending').length
    }
  } catch (e) {
    console.error('获取游记列表失败', e)
  }
}

onMounted(() => {
  loadNotes()
})

const comments = ref([
  {
    userName: '用户A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    time: '2026-05-07 14:30',
    content: '这个活动太棒了！请问怎么报名？',
    relatedTitle: '黄山日出两日游',
    status: 'pending',
    statusText: '待审核',
    statusClass: 'pending'
  },
  {
    userName: '用户B',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    time: '2026-05-07 10:20',
    content: '第一次参加，感觉很不错！',
    relatedTitle: '武功山穿越',
    status: 'approved',
    statusText: '已通过',
    statusClass: 'approved'
  },
  {
    userName: '用户C',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    time: '2026-05-06 16:45',
    content: '风景真的很美，推荐大家去！',
    relatedTitle: '九华山祈福',
    status: 'approved',
    statusText: '已通过',
    statusClass: 'approved'
  }
])

const approveNote = (note: any) => {
  note.status = 'approved'
  note.statusText = '已发布'
  note.statusClass = 'approved'
  pendingNotes.value--
  uni.showToast({ title: '已通过', icon: 'success' })
}

const rejectNote = (note: any) => {
  uni.showModal({
    title: '确认拒绝',
    content: '确定要拒绝这篇游记吗？',
    success: (res) => {
      if (res.confirm) {
        const index = notes.value.indexOf(note)
        if (index > -1) notes.value.splice(index, 1)
        pendingNotes.value--
        uni.showToast({ title: '已拒绝', icon: 'success' })
      }
    }
  })
}

const handleAction = (item: any, action: string) => {
  if (action === 'approve') {
    item.status = 'approved'
    item.statusText = '已通过'
    item.statusClass = 'approved'
    pendingComments.value--
    uni.showToast({ title: '已通过', icon: 'success' })
  } else if (action === 'reject' || action === 'delete') {
    uni.showModal({
      title: '确认删除',
      content: '确定要删除这条内容吗？',
      success: (res) => {
        if (res.confirm) {
          if (item.status === 'pending') {
            pendingComments.value--
          }
          const list = comments.value
          const index = list.indexOf(item)
          if (index > -1) list.splice(index, 1)
          uni.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.content-page { min-height: 100vh; background: #f5f5f5; }

.tab-bar { display: flex; background: #fff; padding: 0 16px; border-bottom: 1px solid #f0f0f0; }
.tab-item { flex: 1; text-align: center; padding: 14px 0; font-size: 15px; color: #999; position: relative; display: flex; align-items: center; justify-content: center; gap: 6px; &.active { color: #333; font-weight: 600; &::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: #FFD000; border-radius: 2px; } } }
.tab-badge { background: #FF4444; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 10px; }

.content-list { padding: 12px 16px; }
.list-header { margin-bottom: 12px; }
.list-count { font-size: 13px; color: #999; }

.note-item { display: flex; flex-direction: column; background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.note-main { display: flex; align-items: center; }
.note-cover { width: 80px; height: 80px; border-radius: 8px; margin-right: 12px; flex-shrink: 0; }
.note-info { flex: 1; }
.note-title { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 6px; }
.note-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.author-avatar { width: 20px; height: 20px; border-radius: 50%; }
.author-name { font-size: 12px; color: #666; }
.note-date { font-size: 11px; color: #999; margin-left: auto; }
.note-stats { display: flex; gap: 12px; }
.stat { font-size: 11px; color: #999; }
.note-status { font-size: 11px; padding: 4px 10px; border-radius: 12px; align-self: flex-start; flex-shrink: 0; &.pending { background: #FFF3E0; color: #F57C00; } &.approved { background: #E8F5E9; color: #388E3C; } }
.note-actions { display: flex; gap: 12px; border-top: 1px solid #f5f5f5; padding-top: 10px; margin-top: 10px; }

.comment-item { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.comment-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.comment-avatar { width: 36px; height: 36px; border-radius: 50%; }
.comment-user { flex: 1; }
.user-name { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 2px; }
.comment-time { font-size: 11px; color: #999; }
.comment-status { font-size: 11px; padding: 4px 10px; border-radius: 12px; &.pending { background: #FFF3E0; color: #F57C00; } &.approved { background: #E8F5E9; color: #388E3C; } }
.comment-content { display: block; font-size: 14px; color: #333; line-height: 1.5; margin-bottom: 10px; }
.comment-footer { margin-bottom: 10px; }
.related-to { font-size: 12px; color: #999; }
.comment-actions { display: flex; gap: 12px; border-top: 1px solid #f5f5f5; padding-top: 10px; }
.action-btn { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #666; padding: 6px 12px; background: #f5f5f5; border-radius: 16px; .btn-icon { font-size: 14px; } .danger { color: #FF4444; } }
</style>
