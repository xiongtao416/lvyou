<template>
  <view class="publish-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input class="search-input" v-model="searchKeyword" placeholder="搜索活动名称" />
      </view>
      <view class="filter-row">
        <picker mode="date" fields="month" :value="filterMonth" @change="onMonthChange">
          <view class="filter-btn">
            <text class="filter-text">{{ filterMonth || '选择月份' }}</text>
            <text class="filter-arrow">▼</text>
          </view>
        </picker>
        <view class="filter-btn" @click="clearFilter" v-if="filterMonth">
          <text class="filter-text clear">清除筛选</text>
        </view>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-bar">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        {{ tab.label }}
        <view class="tab-badge" v-if="tab.badge > 0">{{ tab.badge }}</view>
        <view class="tab-indicator" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="activity-list">
      <view class="list-content">
        <!-- 预约发布 -->
        <view v-if="currentTab === 0">
          <view class="activity-card scheduled" v-for="item in scheduledList" :key="item.id" @click="openEdit(item)">
            <view class="card-header">
              <image class="card-cover" :src="item.cover" mode="aspectFill" />
              <view class="card-status scheduled">待发布</view>
            </view>
            <view class="card-body">
              <text class="card-title">{{ item.title }}</text>
              <view class="card-meta">
                <text class="meta-item">⏰ 预约：{{ item.scheduledDate }}</text>
              </view>
              <view class="card-footer">
                <view class="card-stats">
                  <text class="stat-item">📅 {{ item.date || '待定' }}</text>
                </view>
                <view class="card-ops">
                  <text class="op-btn" @click.stop="openEdit(item)">编辑</text>
                  <text class="op-btn primary" @click.stop="publishNow(item)">立即发布</text>
                  <text class="op-btn danger" @click.stop="removeItem(item)">删除</text>
                </view>
              </view>
            </view>
          </view>
          <view class="empty-state" v-if="scheduledList.length === 0">
            <text class="empty-icon">⏰</text>
            <text class="empty-text">暂无预约发布</text>
          </view>
        </view>

        <!-- 草稿 -->
        <view v-if="currentTab === 1">
          <view class="activity-card draft" v-for="item in draftList" :key="item.id" @click="openEdit(item)">
            <view class="card-header">
              <image class="card-cover" :src="item.cover" mode="aspectFill" />
              <view class="card-status draft">草稿</view>
            </view>
            <view class="card-body">
              <text class="card-title">{{ item.title }}</text>
              <view class="card-meta">
                <text class="meta-item">📝 保存时间：{{ item.saveTime || '刚刚' }}</text>
              </view>
              <view class="card-footer">
                <view class="card-stats">
                  <text class="stat-item" v-if="item.date">📅 {{ item.date }}</text>
                </view>
                <view class="card-ops">
                  <text class="op-btn" @click.stop="openEdit(item)">编辑</text>
                  <text class="op-btn primary" @click.stop="openSchedule(item)">预约发布</text>
                  <text class="op-btn primary" @click.stop="publishNow(item)">立即发布</text>
                  <text class="op-btn danger" @click.stop="removeItem(item)">删除</text>
                </view>
              </view>
            </view>
          </view>
          <view class="empty-state" v-if="draftList.length === 0">
            <text class="empty-icon">📝</text>
            <text class="empty-text">暂无草稿</text>
            <text class="empty-hint">点击右下角 + 创建新活动</text>
          </view>
        </view>

        <!-- 进行中 -->
        <view v-if="currentTab === 2">
          <view class="activity-card" v-for="item in ongoingList" :key="item.id" @click="goDetail(item)">
            <view class="card-header">
              <image class="card-cover" :src="item.cover" mode="aspectFill" />
              <view class="card-status registering">报名中</view>
            </view>
            <view class="card-body">
              <text class="card-title">{{ item.title }}</text>
              <view class="card-meta">
                <text class="meta-item">📅 {{ item.date }}</text>
                <text class="meta-item">📍 {{ item.location }}</text>
              </view>
              <view class="card-stats">
                <text class="stat-item">👥 {{ item.participants }}人报名</text>
                <text class="stat-item">👁 {{ item.views }}浏览</text>
              </view>
            </view>
          </view>
          <view class="empty-state" v-if="ongoingList.length === 0">
            <text class="empty-icon">📋</text>
            <text class="empty-text">暂无进行中的活动</text>
          </view>
        </view>

        <!-- 已结束 -->
        <view v-if="currentTab === 3">
          <view class="activity-card ended" v-for="item in endedList" :key="item.id" @click="goDetail(item)">
            <view class="card-header">
              <image class="card-cover" :src="item.cover" mode="aspectFill" />
              <view class="card-status completed">已结束</view>
            </view>
            <view class="card-body">
              <text class="card-title">{{ item.title }}</text>
              <view class="card-meta">
                <text class="meta-item">📅 {{ item.date }}</text>
                <text class="meta-item">📍 {{ item.location }}</text>
              </view>
              <view class="card-stats">
                <text class="stat-item">👥 {{ item.participants }}人参与</text>
              </view>
            </view>
          </view>
          <view class="empty-state" v-if="endedList.length === 0">
            <text class="empty-icon">📋</text>
            <text class="empty-text">暂无已结束的活动</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 新建按钮 -->
    <view class="fab" @click="createNew">
      <text class="fab-icon">+</text>
    </view>

    <!-- 编辑弹窗 -->
    <view class="modal-mask" v-if="showEditModal" @click="showEditModal = false">
      <view class="modal-box" @click.stop>
        <view class="modal-header">
          <text class="modal-title">编辑活动</text>
          <text class="modal-close" @click="showEditModal = false">✕</text>
        </view>
        <scroll-view scroll-y class="modal-body">
          <view class="form-item">
            <text class="form-label">活动标题</text>
            <input class="form-input" v-model="editForm.title" placeholder="请输入活动标题" />
          </view>
          <view class="form-item">
            <text class="form-label">活动日期</text>
            <picker mode="date" :value="editForm.date" @change="editForm.date = $event.detail.value">
              <view class="form-picker">{{ editForm.date || '请选择日期' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">活动地点</text>
            <input class="form-input" v-model="editForm.location" placeholder="请输入活动地点" />
          </view>
          <view class="form-item">
            <text class="form-label">活动价格（元）</text>
            <input class="form-input" type="number" v-model="editForm.price" placeholder="0为免费" />
          </view>
          <view class="form-item">
            <text class="form-label">最大人数</text>
            <input class="form-input" type="number" v-model="editForm.maxParticipants" placeholder="请输入最大人数" />
          </view>
          <view class="form-item">
            <text class="form-label">活动简介</text>
            <textarea class="form-textarea" v-model="editForm.description" placeholder="请输入活动简介" />
          </view>
        </scroll-view>
        <view class="modal-footer">
          <view class="modal-btn cancel" @click="showEditModal = false">取消</view>
          <view class="modal-btn preview" @click="previewActivity">预览</view>
          <view class="modal-btn save" @click="saveEdit">保存</view>
        </view>
      </view>
    </view>

    <!-- 预览弹窗 -->
    <view class="modal-mask preview-mask" v-if="showPreviewModal" @click="showPreviewModal = false">
      <view class="preview-box" @click.stop>
        <view class="preview-header">
          <text class="preview-title">活动预览</text>
          <text class="preview-close" @click="showPreviewModal = false">✕</text>
        </view>
        <scroll-view scroll-y class="preview-body">
          <view class="preview-cover">
            <image class="preview-cover-img" :src="editingItem?.cover || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'" mode="aspectFill" />
          </view>
          <view class="preview-content">
            <text class="preview-activity-title">{{ editForm.title || '活动标题' }}</text>
            <view class="preview-price-row">
              <text class="preview-price">¥{{ editForm.price || 0 }}</text>
            </view>
            <view class="preview-info-list">
              <view class="preview-info-item">
                <text class="info-label">📅 活动时间</text>
                <text class="info-value">{{ editForm.date || '待定' }}</text>
              </view>
              <view class="preview-info-item">
                <text class="info-label">📍 集合地点</text>
                <text class="info-value">{{ editForm.location || '待定' }}</text>
              </view>
              <view class="preview-info-item">
                <text class="info-label">👥 人数限制</text>
                <text class="info-value">{{ editForm.maxParticipants ? editForm.maxParticipants + '人' : '不限' }}</text>
              </view>
            </view>
            <view class="preview-section" v-if="editForm.description">
              <text class="preview-section-title">活动介绍</text>
              <text class="preview-desc">{{ editForm.description }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 预约发布弹窗 -->
    <view class="modal-mask" v-if="showScheduleModal" @click="showScheduleModal = false">
      <view class="modal-box schedule-box" @click.stop>
        <view class="modal-header">
          <text class="modal-title">预约发布</text>
          <text class="modal-close" @click="showScheduleModal = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="schedule-info">
            <text class="schedule-label">活动</text>
            <text class="schedule-value">{{ scheduleTarget?.title }}</text>
          </view>
          <view class="schedule-info">
            <text class="schedule-label">发布日期</text>
            <picker mode="date" :value="scheduleDate" :start="todayStr" @change="scheduleDate = $event.detail.value">
              <view class="form-picker">{{ scheduleDate || '请选择发布日期' }}</view>
            </picker>
          </view>
          <view class="schedule-info">
            <text class="schedule-label">发布时间</text>
            <picker mode="time" :value="scheduleTime" @change="scheduleTime = $event.detail.value">
              <view class="form-picker">{{ scheduleTime || '请选择发布时间' }}</view>
            </picker>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn cancel" @click="showScheduleModal = false">取消</view>
          <view class="modal-btn save" @click="confirmSchedule">确认预约</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { activityApi } from '@/utils/http'

const currentTab = ref(0)
const searchKeyword = ref('')
const filterMonth = ref('')

// 统一活动数据
const activities = ref<any[]>([])

const loadActivities = async () => {
  try {
    const res: any = await activityApi.getList()
    if (res) {
      activities.value = Array.isArray(res) ? res : (res.list || [])
    }
  } catch (e) {
    console.error('获取活动列表失败', e)
  }
}

onMounted(() => {
  loadActivities()
})

// 筛选后的列表
const filteredActivities = computed(() => {
  let list = activities.value
  // 关键词搜索
  if (searchKeyword.value) {
    list = list.filter(a => a.title.includes(searchKeyword.value))
  }
  // 月份筛选
  if (filterMonth.value) {
    list = list.filter(a => a.date && a.date.startsWith(filterMonth.value))
  }
  return list
})

// 各状态列表
const scheduledList = computed(() => filteredActivities.value.filter(a => a.status === 'scheduled'))
const draftList = computed(() => filteredActivities.value.filter(a => a.status === 'draft'))
const ongoingList = computed(() => filteredActivities.value.filter(a => a.status === 'registering'))
const endedList = computed(() => filteredActivities.value.filter(a => a.status === 'completed'))

// Tab配置
const tabs = computed(() => [
  { label: '预约', badge: scheduledList.value.length },
  { label: '草稿', badge: draftList.value.length },
  { label: '进行中', badge: ongoingList.value.length },
  { label: '已结束', badge: endedList.value.length }
])

// 月份选择
const onMonthChange = (e: any) => {
  filterMonth.value = e.detail.value.substring(0, 7) // YYYY-MM
}
const clearFilter = () => {
  filterMonth.value = ''
  searchKeyword.value = ''
}

// 编辑弹窗
const showEditModal = ref(false)
const editForm = ref({ id: '', title: '', date: '', location: '', price: '', maxParticipants: '', description: '' })
const editingItem = ref<any>(null)

// 预览弹窗
const showPreviewModal = ref(false)
const previewActivity = () => {
  showPreviewModal.value = true
}

const openEdit = (item: any) => {
  editingItem.value = item
  editForm.value = {
    id: item.id,
    title: item.title,
    date: item.date || '',
    location: item.location || '',
    price: String(item.price || 0),
    maxParticipants: String(item.maxParticipants || 0),
    description: item.description || ''
  }
  showEditModal.value = true
}

const saveEdit = () => {
  if (!editForm.value.title.trim()) {
    uni.showToast({ title: '请输入活动标题', icon: 'none' })
    return
  }
  const item = editingItem.value
  if (item) {
    item.title = editForm.value.title
    item.date = editForm.value.date
    item.location = editForm.value.location
    item.price = Number(editForm.value.price) || 0
    item.maxParticipants = Number(editForm.value.maxParticipants) || 0
    item.description = editForm.value.description
    item.saveTime = new Date().toLocaleString()
  }
  showEditModal.value = false
  uni.showToast({ title: '保存成功', icon: 'success' })
}

// 预约发布弹窗
const showScheduleModal = ref(false)
const scheduleTarget = ref<any>(null)
const scheduleDate = ref('')
const scheduleTime = ref('09:00')
const todayStr = new Date().toISOString().split('T')[0]

const openSchedule = (item: any) => {
  scheduleTarget.value = item
  scheduleDate.value = todayStr
  scheduleTime.value = '09:00'
  showScheduleModal.value = true
}

const confirmSchedule = () => {
  if (!scheduleDate.value) {
    uni.showToast({ title: '请选择发布日期', icon: 'none' })
    return
  }
  const item = scheduleTarget.value
  if (item) {
    item.status = 'scheduled'
    item.scheduledDate = scheduleDate.value + ' ' + scheduleTime.value
  }
  showScheduleModal.value = false
  uni.showToast({ title: '已预约发布', icon: 'success' })
}

// 立即发布
const publishNow = (item: any) => {
  uni.showModal({
    title: '确认发布',
    content: `确定要发布「${item.title}」吗？`,
    success: (res) => {
      if (res.confirm) {
        item.status = 'registering'
        delete item.scheduledDate
        uni.showToast({ title: '发布成功', icon: 'success' })
      }
    }
  })
}

// 删除
const removeItem = (item: any) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${item.title}」吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = activities.value.findIndex(a => a.id === item.id)
        if (index > -1) activities.value.splice(index, 1)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}

// 新建
const createNew = () => {
  const newId = 'new_' + Date.now()
  const newItem = {
    id: newId,
    title: '新建活动',
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    date: '', location: '',
    participants: 0, views: 0, price: 0, maxParticipants: 0,
    description: '',
    status: 'draft', saveTime: new Date().toLocaleString()
  }
  activities.value.unshift(newItem)
  openEdit(newItem)
}

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages/activity/detail?id=${item.id}` })
}
</script>

<style lang="scss" scoped>
.publish-page { min-height: 100vh; background: #f5f5f5; display: flex; flex-direction: column; }

/* 搜索栏 */
.search-bar { background: #fff; padding: 12px 16px; }
.search-input-wrap { display: flex; align-items: center; background: #f5f5f5; border-radius: 20px; padding: 8px 14px; margin-bottom: 10px; }
.search-icon { font-size: 14px; margin-right: 8px; }
.search-input { flex: 1; font-size: 14px; color: #333; background: transparent; }
.filter-row { display: flex; gap: 10px; }
.filter-btn { display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: #f5f5f5; border-radius: 16px; }
.filter-text { font-size: 13px; color: #666; &.clear { color: #FF6B00; } }
.filter-arrow { font-size: 10px; color: #999; }

/* Tab栏 */
.tab-bar { display: flex; background: #fff; padding: 0 8px; border-bottom: 1px solid #f0f0f0; }
.tab-item { flex: 1; text-align: center; padding: 14px 0; font-size: 14px; color: #999; position: relative;
  &.active { color: #333; font-weight: 600; }
}
.tab-badge { position: absolute; top: 6px; right: 12px; background: #FF4444; color: #fff; font-size: 10px; padding: 1px 5px; border-radius: 8px; min-width: 16px; }
.tab-indicator { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: #FFD000; border-radius: 2px; }

.activity-list { flex: 1; height: calc(100vh - 120px); }
.list-content { padding: 12px 16px; }

/* 卡片 */
.activity-card { background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  &.draft { border-left: 3px solid #FFC107; }
  &.scheduled { border-left: 3px solid #2196F3; }
  &.ended { opacity: 0.85; }
}
.card-header { position: relative; height: 140px; }
.card-cover { width: 100%; height: 100%; }
.card-status { position: absolute; top: 10px; right: 10px; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500;
  &.registering { background: rgba(67,160,71,0.9); color: #fff; }
  &.completed { background: rgba(158,158,158,0.9); color: #fff; }
  &.draft { background: rgba(255,193,7,0.9); color: #333; }
  &.scheduled { background: rgba(33,150,243,0.9); color: #fff; }
}
.card-body { padding: 14px; }
.card-title { display: block; font-size: 15px; font-weight: 600; color: #333; margin-bottom: 8px; line-height: 1.4; }
.card-meta { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
.meta-item { font-size: 12px; color: #666; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-stats { display: flex; gap: 12px; }
.stat-item { font-size: 12px; color: #999; }
.card-ops { display: flex; gap: 8px; }
.op-btn { font-size: 12px; padding: 4px 10px; border-radius: 12px; background: #f5f5f5; color: #666;
  &.primary { background: #FFF8E1; color: #F57C00; }
  &.danger { background: #FFEBEE; color: #FF5252; }
}

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 0; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { font-size: 14px; color: #999; margin-bottom: 4px; }
.empty-hint { font-size: 12px; color: #ccc; }

.fab { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(102,126,234,0.4); z-index: 100; }
.fab-icon { font-size: 32px; color: #fff; font-weight: 300; }

/* 弹窗 */
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
.modal-box { background: #fff; border-radius: 20px 20px 0 0; width: 100%; max-height: 85vh; display: flex; flex-direction: column; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; border-bottom: 1px solid #f0f0f0; }
.modal-title { font-size: 17px; font-weight: 600; color: #333; }
.modal-close { font-size: 20px; color: #999; padding: 4px; }
.modal-body { flex: 1; padding: 16px 20px; min-height: 200px; }
.modal-footer { display: flex; gap: 10px; padding: 14px 20px; border-top: 1px solid #f0f0f0; }
.modal-btn { flex: 1; text-align: center; padding: 12px; border-radius: 12px; font-size: 15px; font-weight: 500;
  &.cancel { background: #f5f5f5; color: #666; }
  &.preview { background: #E8F5E9; color: #43A047; }
  &.save { background: #FFD000; color: #333; }
}

.form-item { margin-bottom: 16px; }
.form-label { display: block; font-size: 13px; color: #666; margin-bottom: 8px; }
.form-input { width: 100%; height: 42px; background: #f8f8f8; border-radius: 10px; padding: 0 14px; font-size: 14px; color: #333; box-sizing: border-box; }
.form-picker { width: 100%; height: 42px; background: #f8f8f8; border-radius: 10px; padding: 0 14px; font-size: 14px; color: #333; display: flex; align-items: center; box-sizing: border-box; }
.form-textarea { width: 100%; height: 80px; background: #f8f8f8; border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #333; box-sizing: border-box; }

.schedule-box .modal-body { min-height: auto; }
.schedule-info { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f5f5f5; &:last-child { border-bottom: none; } }
.schedule-label { font-size: 14px; color: #666; }
.schedule-value { font-size: 14px; color: #333; font-weight: 500; }

/* 预览 */
.preview-mask { z-index: 300; }
.preview-box { background: #fff; border-radius: 20px 20px 0 0; width: 100%; max-height: 90vh; display: flex; flex-direction: column; }
.preview-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.preview-title { font-size: 17px; font-weight: 600; color: #333; }
.preview-close { font-size: 20px; color: #999; padding: 4px; }
.preview-body { flex: 1; }
.preview-cover { width: 100%; height: 200px; }
.preview-cover-img { width: 100%; height: 100%; }
.preview-content { padding: 16px 20px; }
.preview-activity-title { font-size: 18px; font-weight: 700; color: #333; line-height: 1.4; margin-bottom: 12px; display: block; }
.preview-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
.preview-price { font-size: 24px; font-weight: 700; color: #FF6B00; }
.preview-info-list { background: #f8f8f8; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.preview-info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; &:last-child { border-bottom: none; } }
.info-label { font-size: 14px; color: #666; }
.info-value { font-size: 14px; color: #333; font-weight: 500; }
.preview-section { margin-top: 16px; }
.preview-section-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 10px; display: block; }
.preview-desc { font-size: 14px; color: #666; line-height: 1.6; }
</style>
