<template>
  <view class="login-page">
    <view class="login-content">
      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="logo">
          <text class="iconfont icon-mountain"></text>
        </view>
        <text class="app-name">户外探索</text>
        <text class="app-slogan">高校教职工户外活动平台</text>
      </view>

      <!-- 登录按钮 -->
      <view class="login-section">
        <button 
          class="wx-login-btn" 
          @click="handleWxLogin"
          :loading="loading"
        >
          <text class="iconfont icon-wechat"></text>
          <text>微信一键登录</text>
        </button>
        
        <view class="login-tips">
          <text class="tips-icon">!</text>
          <text>首次报名时需完善个人信息</text>
        </view>
      </view>

      <!-- 协议 -->
      <view class="agreement-section">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox :checked="agreed" color="#4A6FA5" />
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @click.stop="showUserAgreement">《用户协议》</text>
              和
              <text class="link" @click.stop="showPrivacyPolicy">《隐私政策》</text>
            </text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { wxLogin } from '@/utils/request'

const loading = ref(false)
const agreed = ref(false)

// 处理协议勾选
const handleAgreementChange = (e: any) => {
  agreed.value = e.detail.value.length > 0
}

// 微信登录
const handleWxLogin = async () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }

  loading.value = true
  
  try {
    // 获取用户信息授权
    const [profileErr, profileRes] = await uni.getUserProfile({
      desc: '用于完善用户资料'
    })
    
    if (profileErr) {
      throw profileErr
    }

    // 执行登录
    const loginResult = await wxLogin()
    
    // 更新用户信息
    await uniCloud.callFunction({
      name: 'user',
      data: {
        action: 'updateProfile',
        userInfo: profileRes.userInfo
      }
    })

    uni.showToast({ title: '登录成功', icon: 'success' })
    
    // 返回上一页或跳转到首页
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    }, 1500)
  } catch (error: any) {
    console.error('登录失败:', error)
    uni.showToast({ 
      title: error.message || '登录失败，请重试', 
      icon: 'none' 
    })
  } finally {
    loading.value = false
  }
}

// 显示用户协议
const showUserAgreement = () => {
  uni.navigateTo({ url: '/pages/agreement/user' })
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  uni.navigateTo({ url: '/pages/agreement/privacy' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #4A6FA5 0%, #6B8CBB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-content {
  width: 100%;
  max-width: 320px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.logo {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.logo .iconfont {
  font-size: 56px;
  color: #fff;
}

.app-name {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.app-slogan {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.login-section {
  margin-bottom: 30px;
}

.wx-login-btn {
  width: 100%;
  height: 48px;
  background: #07C160;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.wx-login-btn .iconfont {
  font-size: 24px;
}

.login-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.tips-icon {
  width: 14px;
  height: 14px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.agreement-section {
  text-align: center;
}

.agreement-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.agreement-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.link {
  color: #FFD000;
}
</style>
