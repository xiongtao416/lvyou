<template>
  <view class="users-page">
    <!-- 管理员列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">管理员列表</text>
        <text class="add-btn" @click="showAddModal">+ 添加</text>
      </view>
      
      <view class="admin-list">
        <view class="admin-item" v-for="(admin, index) in adminList" :key="index">
          <image class="admin-avatar" :src="admin.avatar" mode="aspectFill" />
          <view class="admin-info">
            <text class="admin-name">{{ admin.name }}</text>
            <text class="admin-role">{{ admin.role }}</text>
          </view>
          <view class="admin-status" :class="admin.status">
            <text>{{ admin.status === 'active' ? '已启用' : '已禁用' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 权限说明 -->
    <view class="section">
      <view class="section-title">权限说明</view>
      <view class="permission-list">
        <view class="permission-item">
          <text class="perm-icon">👑</text>
          <view class="perm-info">
            <text class="perm-title">超级管理员</text>
            <text class="perm-desc">拥有所有权限，包括用户管理、系统设置</text>
          </view>
        </view>
        <view class="permission-item">
          <text class="perm-icon">📅</text>
          <view class="perm-info">
            <text class="perm-title">活动组织者</text>
            <text class="perm-desc">可发布活动、管理报名、查看数据</text>
          </view>
        </view>
        <view class="permission-item">
          <text class="perm-icon">👤</text>
          <view class="perm-info">
            <text class="perm-title">普通用户</text>
            <text class="perm-desc">可报名活动、发布游记</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/utils/http'

const adminList = ref<any[]>([])

const loadAdminList = async () => {
  try {
    const res: any = await userApi.getAdminList()
    if (res) {
      adminList.value = Array.isArray(res) ? res : (res.list || [])
    }
  } catch (e) {
    console.error('获取管理员列表失败', e)
  }
}

onMounted(() => {
  loadAdminList()
})

// 显示添加弹窗
const showAddModal = () => {
  uni.showToast({ title: '添加功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.users-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 16px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.add-btn {
  font-size: 14px;
  color: #FFD000;
  font-weight: 600;
}

.admin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 12px;
}

.admin-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.admin-info {
  flex: 1;
}

.admin-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.admin-role {
  font-size: 12px;
  color: #999;
}

.admin-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  
  &.active {
    background: #E8F5E9;
    color: #388E3C;
  }
  
  &.inactive {
    background: #FFEBEE;
    color: #D32F2F;
  }
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.perm-icon {
  font-size: 24px;
}

.perm-info {
  flex: 1;
}

.perm-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.perm-desc {
  font-size: 12px;
  color: #999;
}
</style>
