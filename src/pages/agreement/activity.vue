<template>
  <view class="agreement-page">
    <view class="header">
      <text class="title">活动报名协议</text>
      <text class="update-date">更新日期：2026年5月1日</text>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <view class="content-body">
        <text class="section-title">一、活动须知</text>
        <text class="paragraph">1. 报名者须年满18周岁，具有完全民事行为能力。未满18周岁的参与者需由监护人陪同并签署知情同意书。</text>
        <text class="paragraph">2. 报名者应确保自身身体健康，无不适合户外活动的疾病，包括但不限于心脏病、高血压、哮喘等。如有特殊情况，请提前告知组织者。</text>
        <text class="paragraph">3. 报名者应如实填写个人信息，因信息不实导致无法购买保险或产生其他问题的，后果由报名者自行承担。</text>

        <text class="section-title">二、费用与退款</text>
        <text class="paragraph">1. 活动费用包含：交通、门票、住宿（如有）、领队服务、户外保险等，具体以活动详情页说明为准。</text>
        <text class="paragraph">2. 活动开始前7天以上取消报名，可全额退款；活动开始前3-7天取消，退还50%费用；活动开始前3天以内取消，不予退款。</text>
        <text class="paragraph">3. 因不可抗力（如极端天气、自然灾害等）导致活动取消的，将全额退款。</text>

        <text class="section-title">三、安全与责任</text>
        <text class="paragraph">1. 活动期间，报名者须服从领队安排，不得擅自离队或进行危险行为。</text>
        <text class="paragraph">2. 组织方将为每位参与者购买户外意外保险，但报名者仍需对自身安全负责。</text>
        <text class="paragraph">3. 因报名者个人原因导致的人身伤害或财产损失，组织方不承担赔偿责任。</text>

        <text class="section-title">四、知识产权</text>
        <text class="paragraph">1. 活动中拍摄的影像资料，组织方有权用于宣传推广，报名者报名即视为同意授权。</text>
        <text class="paragraph">2. 未经组织方许可，报名者不得将活动内容用于商业用途。</text>

        <text class="section-title">五、其他条款</text>
        <text class="paragraph">1. 本协议自报名成功之日起生效。</text>
        <text class="paragraph">2. 本协议的解释和执行适用中华人民共和国法律。如发生争议，双方应友好协商解决。</text>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <button class="confirm-btn" @click="goBack">我知道了</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.agreement-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 20px 16px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
}

.update-date {
  font-size: 12px;
  color: #999;
}

.content-scroll {
  flex: 1;
  height: calc(100vh - 140px);
}

.content-body {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 20px 16px;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 12px;

  &:first-child {
    margin-top: 0;
  }
}

.paragraph {
  display: block;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 10px;
}

.bottom-bar {
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.confirm-btn {
  width: 100%;
  height: 48px;
  background: #FFD000;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  border: none;
}
</style>
