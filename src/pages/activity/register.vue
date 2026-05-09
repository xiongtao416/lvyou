<template>
  <view class="register-page">
    <!-- 活动信息卡片 -->
    <view class="activity-card">
      <image class="activity-image" :src="activity.coverImage" mode="aspectFill" />
      <view class="activity-info">
        <text class="activity-title">{{ activity.title }}</text>
        <view class="activity-meta">
          <text class="meta-item">
            <text class="iconfont icon-time"></text>
            {{ formatDate(activity.startDate) }}
          </text>
          <text class="meta-item">
            <text class="iconfont icon-location"></text>
            {{ activity.location }}
          </text>
        </view>
        <view class="activity-price">
          <text class="price-label">报名费用</text>
          <text class="price-value">¥{{ activity.price }}</text>
          <text class="price-unit">/人</text>
        </view>
      </view>
    </view>

    <!-- 首次报名提示 -->
    <view class="tips-box" v-if="!userInfo.isProfileComplete">
      <text class="iconfont icon-info"></text>
      <text>首次报名需完善个人信息，之后将自动填充</text>
    </view>

    <!-- 报名信息表单 -->
    <view class="form-section">
      <view class="section-title">报名信息</view>

      <view class="form-item">
        <text class="form-label">真实姓名 <text class="required">*</text></text>
        <input
          class="form-input"
          v-model="form.realName"
          placeholder="请输入真实姓名"
        />
      </view>

      <view class="form-item">
        <text class="form-label">手机号码 <text class="required">*</text></text>
        <input
          class="form-input"
          v-model="form.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号码"
        />
      </view>

      <view class="form-item">
        <text class="form-label">所在单位</text>
        <input
          class="form-input"
          v-model="form.department"
          placeholder="请输入所在单位"
        />
      </view>

      <view class="form-item">
        <text class="form-label">身份证号</text>
        <input
          class="form-input"
          v-model="form.idCard"
          placeholder="用于购买保险"
        />
      </view>

      <view class="form-item">
        <text class="form-label">报名人数</text>
        <view class="counter">
          <view class="counter-btn" @click="decreaseCount">-</view>
          <text class="counter-value">{{ form.count }}</text>
          <view class="counter-btn" @click="increaseCount">+</view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">出发方式</text>
        <view class="radio-group">
          <view
            class="radio-item"
            :class="{ active: form.transport === 'self' }"
            @click="form.transport = 'self'"
          >
            <text>自驾</text>
          </view>
          <view
            class="radio-item"
            :class="{ active: form.transport === 'bus' }"
            @click="form.transport = 'bus'"
          >
            <text>大巴</text>
          </view>
          <view
            class="radio-item"
            :class="{ active: form.transport === 'other' }"
            @click="form.transport = 'other'"
          >
            <text>其他</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea
          class="form-textarea"
          v-model="form.remark"
          placeholder="如有特殊需求请备注"
        />
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="fee-section">
      <view class="section-title">费用明细</view>
      <view class="fee-row">
        <text>报名费用</text>
        <text>¥{{ activity.price }} x {{ form.count }}人</text>
      </view>
      <view class="fee-row">
        <text>预报名费</text>
        <text class="fee-desc">活动开始前3天可全额退款</text>
      </view>
      <view class="fee-row total">
        <text>合计</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement-section">
      <checkbox-group @change="handleAgreementChange">
        <label class="agreement-label">
          <checkbox :checked="agreed" color="#4A6FA5" />
          <text class="agreement-text">
            我已阅读并同意
            <text class="link" @click.stop="showAgreement">《活动报名协议》</text>
          </text>
        </label>
      </checkbox-group>
    </view>

    <!-- 底部提交栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="price-label">合计:</text>
        <text class="price-value">¥{{ totalPrice }}</text>
      </view>
      <button class="submit-btn" :loading="submitting" @click="handleSubmit">
        确认报名
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getRouteParam } from '@/utils/route'
import { activityApi, registrationApi } from '@/utils/http'
import { formatDate } from '@/utils/format'
import type { Activity } from '@/types'

const activity = ref<Partial<Activity>>({})
const userInfo = ref<any>(({ isProfileComplete: false }))
const submitting = ref(false)
const agreed = ref(false)
const loading = ref(false)

const form = ref({
  realName: '',
  phone: '',
  department: '',
  idCard: '',
  count: 1,
  transport: 'self',
  remark: ''
})

// 计算总价
const totalPrice = computed(() => {
  return (activity.value.price || 0) * form.value.count
})

onMounted(() => {
  // 使用统一工具获取路由参数
  const id = getRouteParam('id')

  if (id) {
    loadActivity(id)
  }
  // 用户信息暂时用空值，后期从API获取
})

// 从 API 加载活动信息
const loadActivity = async (id: string) => {
  loading.value = true
  try {
    const res: any = await activityApi.getById(id)
    activity.value = res
  } catch (error) {
    console.error('加载活动失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 增加人数
const increaseCount = () => {
  if (form.value.count < 10) {
    form.value.count++
  }
}

// 减少人数
const decreaseCount = () => {
  if (form.value.count > 1) {
    form.value.count--
  }
}

// 协议勾选
const handleAgreementChange = (e: any) => {
  agreed.value = e.detail.value.length > 0
}

// 显示协议
const showAgreement = () => {
  uni.navigateTo({ url: '/pages/agreement/activity' })
}

// 提交报名
const handleSubmit = async () => {
  // 表单验证
  if (!form.value.realName.trim()) {
    uni.showToast({ title: '请输入真实姓名', icon: 'none' })
    return
  }
  if (!form.value.phone.trim() || !/^1[3-9]\d{9}$/.test(form.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return
  }
  // 身份证号验证（18位，最后一位可为X）
  if (!form.value.idCard.trim()) {
    uni.showToast({ title: '请输入身份证号', icon: 'none' })
    return
  }
  if (!/^\d{17}[\dXx]$/.test(form.value.idCard)) {
    uni.showToast({ title: '请输入正确的18位身份证号', icon: 'none' })
    return
  }
  if (!agreed.value) {
    uni.showToast({ title: '请先同意报名协议', icon: 'none' })
    return
  }

  submitting.value = true

  try {
    await registrationApi.create({
      activityId: activity.value.id,
      userName: form.value.realName,
      userPhone: form.value.phone,
      department: form.value.department,
      userCount: form.value.count,
      remark: form.value.remark
    })
    uni.showToast({ title: '报名成功', icon: 'success' })
    submitting.value = false
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/profile/my-activities' })
    }, 1500)
  } catch (error) {
    submitting.value = false
    // 错误已在http.ts中统一处理
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.activity-card {
  display: flex;
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.activity-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  margin-right: 12px;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activity-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  font-size: 12px;
  color: #666;
}

.activity-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  color: #999;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #FF6B00;
}

.price-unit {
  font-size: 12px;
  color: #999;
}

.tips-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF8E1;
  padding: 12px 15px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #FF8F00;
}

.form-section, .fee-section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.form-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #FF4444;
  font-weight: 600;
}

.form-input {
  height: 48px;
  background: #f8f8f8;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  border: 1px solid transparent;

  &:focus {
    border-color: #FFD000;
    background: #fff;
  }
}

.form-textarea {
  height: 100px;
  background: #f8f8f8;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  border: 1px solid transparent;

  &:focus {
    border-color: #FFD000;
    background: #fff;
  }
}

.counter {
  display: flex;
  align-items: center;
  gap: 15px;
}

.counter-btn {
  width: 36px;
  height: 36px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
}

.counter-value {
  font-size: 16px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.radio-group {
  display: flex;
  gap: 12px;
}

.radio-item {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  background: #f8f8f8;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;

  &.active {
    color: #333;
    font-weight: 600;
    border-color: #FFD000;
    background: #FFF8E1;
  }
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;

  &.total {
    border-bottom: none;
    padding-top: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.fee-desc {
  font-size: 12px;
  color: #999;
}

.total-price {
  color: #FF6B00;
  font-size: 20px;
}

.agreement-section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.agreement-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agreement-text {
  font-size: 13px;
  color: #666;
}

.link {
  color: #4A6FA5;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid #f0f0f0;
  z-index: 100;
}

.price-info {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.submit-btn {
  width: 140px;
  height: 48px;
  background: #FFD000;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  border: none;
}
</style>
