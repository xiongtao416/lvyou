<template>
  <view class="edit-page">
    <!-- 头像区域 -->
    <view class="avatar-section">
      <view class="avatar-wrapper" @click="changeAvatar">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="avatar-edit">
          <text class="edit-icon">📷</text>
        </view>
      </view>
      <text class="avatar-tip">点击更换头像</text>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-group">
        <text class="form-label">昵称</text>
        <input class="form-input" v-model="userInfo.nickName" placeholder="请输入昵称" />
      </view>

      <view class="form-group">
        <text class="form-label">真实姓名 <text class="required">*</text></text>
        <input class="form-input" v-model="userInfo.realName" placeholder="请输入真实姓名" />
      </view>

      <view class="form-group">
        <text class="form-label">手机号码 <text class="required">*</text></text>
        <input class="form-input" v-model="userInfo.phone" type="number" maxlength="11" placeholder="请输入手机号码" />
      </view>

      <view class="form-group">
        <text class="form-label">所在单位</text>
        <input class="form-input" v-model="userInfo.department" placeholder="请输入所在单位" />
      </view>

      <view class="form-group">
        <text class="form-label">身份证号</text>
        <input class="form-input" v-model="userInfo.idCard" placeholder="用于购买户外保险" />
        <text class="form-hint">仅用于购买户外活动保险，不会泄露给第三方</text>
      </view>

      <view class="form-group">
        <text class="form-label">个人简介</text>
        <textarea class="form-textarea" v-model="userInfo.bio" placeholder="介绍一下自己吧~" maxlength="200" />
        <text class="form-hint">{{ (userInfo.bio || '').length }}/200</text>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-section">
      <button class="save-btn" @click="handleSave">保存修改</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/utils/http'

const userInfo = ref<any>({
  avatar: '',
  nickName: '',
  realName: '',
  phone: '',
  department: '',
  idCard: '',
  bio: ''
})
const saving = ref(false)

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res: any = await userApi.getList({ pageSize: 1 })
    const list = res?.list || (Array.isArray(res) ? res : [])
    if (list.length > 0) {
      const user = list[0]
      userInfo.value = {
        avatar: user.avatar || '',
        nickName: user.nickname || '',
        realName: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        idCard: user.idCard || '',
        bio: user.bio || ''
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
    }
  })
}

// 保存
const handleSave = async () => {
  if (!userInfo.value.realName.trim()) {
    uni.showToast({ title: '请输入真实姓名', icon: 'none' })
    return
  }
  if (!userInfo.value.phone.trim() || !/^1[3-9]\d{9}$/.test(userInfo.value.phone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return
  }

  saving.value = true
  try {
    const res: any = await userApi.getList({ pageSize: 1 })
    const list = res?.list || (Array.isArray(res) ? res : [])
    if (list.length > 0) {
      const userId = list[0].id
      await userApi.update(userId, {
        nickname: userInfo.value.nickName,
        name: userInfo.value.realName,
        phone: userInfo.value.phone,
        department: userInfo.value.department,
        idCard: userInfo.value.idCard,
        bio: userInfo.value.bio,
        avatar: userInfo.value.avatar
      })
    }
    // 同时更新本地缓存
    uni.setStorageSync('userInfo', userInfo.value)
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('保存失败:', error)
    // 错误已在http.ts中统一处理
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
.edit-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;
  background: #fff;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #f0f0f0;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #FFD000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.edit-icon {
  font-size: 16px;
}

.avatar-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.form-section {
  background: #fff;
  margin-top: 12px;
  padding: 0 16px;
}

.form-group {
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 10px;
}

.required {
  color: #FF4444;
  font-weight: 700;
}

.form-input {
  height: 48px;
  background: #f8f8f8;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: #333;
  
  &:focus {
    background: #fff;
    border: 2px solid #FFD000;
    padding: 0 14px;
  }
}

.form-textarea {
  height: 100px;
  background: #f8f8f8;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  color: #333;
  width: 100%;
  box-sizing: border-box;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  text-align: right;
}

.save-section {
  padding: 30px 16px;
}

.save-btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #FFD000 0%, #FFA500 100%);
  color: #333;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
  border: none;
  box-shadow: 0 4px 16px rgba(255, 208, 0, 0.3);
}
</style>
