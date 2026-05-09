/**
 * 活动数据模型
 */
const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  expanded: { type: Boolean, default: false },
  schedule: [{
    time: { type: String },
    content: { type: String }
  }]
})

const activitySchema = new mongoose.Schema({
  // 基本信息
  title: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  cover: { type: String },

  // 时间地点
  startDate: { type: String, required: true },
  startTime: { type: String },
  endDate: { type: String },
  location: { type: String, required: true },
  meetingPoint: { type: String },

  // 费用
  price: { type: Number, required: true, default: 0 },
  feeInclude: [{ type: String }],
  feeExclude: [{ type: String }],

  // 人数
  maxParticipants: { type: Number, default: 50 },
  participantCount: { type: Number, default: 0 },

  // 组织者
  organizer: {
    avatarUrl: { type: String },
    nickName: { type: String }
  },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // 详情
  description: { type: String },
  itinerary: [itinerarySchema],
  notices: [{
    title: { type: String },
    content: { type: String }
  }],

  // 参与者
  participants: [{
    avatar: { type: String },
    name: { type: String }
  }],

  // 状态
  status: {
    type: String,
    enum: ['draft', 'registering', 'full', 'ongoing', 'completed', 'cancelled'],
    default: 'registering'
  },

  // 统计
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },

  // 时间戳
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
})

// 更新时自动更新 updateTime
activitySchema.pre('save', function (next) {
  this.updateTime = new Date()
  next()
})

module.exports = mongoose.model('Activity', activitySchema)
