/**
 * 游记数据模型
 */
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  // 关联
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // 内容
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  coverImage: { type: String },
  tags: [{ type: String }],

  // 作者信息（冗余，方便查询）
  authorName: { type: String },
  authorAvatar: { type: String },

  // 统计
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },

  // 状态
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // 时间戳
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
})

noteSchema.pre('save', function (next) {
  this.updateTime = new Date()
  next()
})

module.exports = mongoose.model('Note', noteSchema)
