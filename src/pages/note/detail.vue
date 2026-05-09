<template>
  <view class="note-detail-page">
    <!-- 顶部大图 -->
    <view class="hero-section">
      <image
        class="hero-image"
        :src="note.coverImage"
        mode="aspectFill"
      />
      <!-- 渐变遮罩 -->
      <view class="hero-overlay">
        <view class="hero-title-wrap">
          <text class="hero-title">{{ note.title }}</text>
        </view>
      </view>
      <!-- 返回按钮 -->
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-arrow-left"></text>
      </view>
    </view>

    <!-- 作者信息 -->
    <view class="author-section" v-if="note.title">
      <image class="author-avatar" :src="note.author.avatar" mode="aspectFill" />
      <view class="author-info">
        <text class="author-name">{{ note.author.name }}</text>
        <view class="author-meta">
          <text class="publish-date">{{ note.publishDate }}</text>
          <text class="meta-dot">·</text>
          <text class="view-count">{{ note.viewCount }} 浏览</text>
        </view>
      </view>
      <button class="follow-btn" size="mini">+ 关注</button>
    </view>

    <!-- 正文内容 -->
    <scroll-view scroll-y class="content-scroll" v-if="note.title">
      <view class="content-body">
        <!-- 第一段 -->
        <view class="text-block">
          <text class="content-text">{{ note.content[0] }}</text>
        </view>

        <!-- 插入图片1 -->
        <view class="content-image-wrap">
          <image
            class="content-image"
            :src="note.images[0]"
            mode="widthFix"
            @click="previewImage(0)"
          />
        </view>

        <!-- 第二段 -->
        <view class="text-block">
          <text class="content-text">{{ note.content[1] }}</text>
        </view>

        <!-- 插入图片2 -->
        <view class="content-image-wrap">
          <image
            class="content-image"
            :src="note.images[1]"
            mode="widthFix"
            @click="previewImage(1)"
          />
        </view>

        <!-- 第三段 -->
        <view class="text-block">
          <text class="content-text">{{ note.content[2] }}</text>
        </view>

        <!-- 插入图片3 -->
        <view class="content-image-wrap">
          <image
            class="content-image"
            :src="note.images[2]"
            mode="widthFix"
            @click="previewImage(2)"
          />
        </view>

        <!-- 第四段 -->
        <view class="text-block">
          <text class="content-text">{{ note.content[3] }}</text>
        </view>

        <!-- 标签 -->
        <view class="tags-section">
          <text class="tag-item" v-for="(tag, i) in note.tags" :key="i">#{{ tag }}</text>
        </view>

        <view style="height: 80px;"></view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="note.title">
      <view class="action-item" @click="handleLike">
        <text class="iconfont" :class="isLiked ? 'icon-like-fill liked' : 'icon-like'"></text>
        <text class="action-text" :class="{ liked: isLiked }">{{ note.likeCount }}</text>
      </view>
      <view class="action-item" @click="handleFavorite">
        <text class="iconfont" :class="isFavorited ? 'icon-star-fill favorited' : 'icon-star'"></text>
        <text class="action-text" :class="{ favorited: isFavorited }">{{ note.favoriteCount }}</text>
      </view>
      <view class="action-item" @click="handleComment">
        <text class="iconfont icon-message"></text>
        <text class="action-text">{{ note.commentCount }}</text>
      </view>
      <view class="action-item" @click="handleShare">
        <text class="iconfont icon-share"></text>
        <text class="action-text">分享</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { noteApi } from '@/utils/http'
import { getRouteParam } from '@/utils/route'

const isLiked = ref(false)
const isFavorited = ref(false)
const loading = ref(false)

const note = ref<any>({
  coverImage: '',
  title: '',
  author: {},
  publishDate: '',
  viewCount: 0,
  content: [],
  images: [],
  tags: [],
  likeCount: 0,
  favoriteCount: 0,
  commentCount: 0
})

onMounted(() => {
  loadNoteDetail()
})

// 从API加载游记详情
const loadNoteDetail = async () => {
  loading.value = true
  try {
    const id = getRouteParam('id')
    let data: any = null

    if (id) {
      // 有ID时，通过详情接口获取
      data = await noteApi.getById(id)
    } else {
      // 没有ID时，获取列表第一条
      const res: any = await noteApi.getList({ status: 'approved', pageSize: 1 })
      const list = res?.list || (Array.isArray(res) ? res : [])
      if (list.length > 0) data = list[0]
    }

    if (data) {
      note.value = {
        coverImage: data.coverImage || (data.images && data.images[0]) || '',
        title: data.title,
        author: {
          avatar: data.authorAvatar,
          name: data.authorName
        },
        publishDate: data.createTime ? data.createTime.split('T')[0] : '',
        viewCount: data.views || 0,
        content: data.content ? data.content.split('\n\n') : [],
        images: data.images || [],
        tags: data.tags || [],
        likeCount: data.likes || 0,
        favoriteCount: data.favorites || 0,
        commentCount: data.commentCount || 0
      }
    }
  } catch (error) {
    console.error('加载游记失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    current: note.value.images[index],
    urls: note.value.images
  })
}

// 点赞
const handleLike = () => {
  isLiked.value = !isLiked.value
  note.value.likeCount += isLiked.value ? 1 : -1
  uni.showToast({
    title: isLiked.value ? '已点赞' : '已取消点赞',
    icon: 'none'
  })
}

// 收藏
const handleFavorite = () => {
  isFavorited.value = !isFavorited.value
  note.value.favoriteCount += isFavorited.value ? 1 : -1
  uni.showToast({
    title: isFavorited.value ? '已收藏' : '已取消收藏',
    icon: 'none'
  })
}

// 评论
const handleComment = () => {
  uni.showToast({ title: '评论功能开发中', icon: 'none' })
}

// 分享
const handleShare = () => {
  uni.showActionSheet({
    itemList: ['分享到微信好友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      uni.showToast({ title: '分享成功', icon: 'none' })
    }
  })
}
</script>

<style lang="scss" scoped>
.note-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.hero-section {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  padding: 0 20px 20px;
}

.hero-title-wrap {
  width: 100%;
}

.hero-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.back-btn {
  position: absolute;
  top: 50px;
  left: 15px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 10;
}

.author-section {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  display: block;
}

.author-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.publish-date {
  font-size: 12px;
  color: #999;
}

.meta-dot {
  font-size: 12px;
  color: #ccc;
}

.view-count {
  font-size: 12px;
  color: #999;
}

.follow-btn {
  background: #FFD000;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 16px;
  border: none;
}

.content-scroll {
  height: calc(100vh - 380px);
}

.content-body {
  padding: 20px 15px;
}

.text-block {
  margin-bottom: 20px;
}

.content-text {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
  letter-spacing: 0.5px;
}

.content-image-wrap {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
}

.content-image {
  width: 100%;
  border-radius: 12px;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.tag-item {
  font-size: 13px;
  color: #4A90D9;
  background: #EBF3FD;
  padding: 4px 12px;
  border-radius: 16px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
  z-index: 100;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
}

.action-text {
  font-size: 13px;
  color: #666;

  &.liked {
    color: #FF4444;
  }

  &.favorited {
    color: #FFD000;
  }
}

.iconfont {
  font-size: 20px;
  color: #666;

  &.liked {
    color: #FF4444;
  }

  &.favorited {
    color: #FFD000;
  }
}
</style>
