/**
 * 报名数据模型
 */
const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
  // 关联
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // 报名信息
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userAvatar: { type: String },
  department: { type: String },
  userCount: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },

  // 备注
  remark: { type: String },

  // 状态
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // 时间戳
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
})

registrationSchema.pre('save', function (next) {
  this.updateTime = new Date()
  next()
})

module.exports = mongoose.model('Registration', registrationSchema)
