/**
 * 用户数据模型
 */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  // 基本信息
  nickname: { type: String, required: true },
  name: { type: String },          // 真实姓名
  avatar: { type: String },
  phone: { type: String, unique: true, sparse: true },
  gender: { type: Number, default: 0 },  // 0未知 1男 2女
  department: { type: String },    // 院系/部门
  idCard: { type: String },        // 身份证号（加密存储）

  // 角色
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },

  // 统计
  stats: {
    joinCount: { type: Number, default: 0 },
    upcomingCount: { type: Number, default: 0 },
    noteCount: { type: Number, default: 0 }
  },

  // 状态
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },

  // 时间戳
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
})

userSchema.pre('save', function (next) {
  this.updateTime = new Date()
  next()
})

module.exports = mongoose.model('User', userSchema)
