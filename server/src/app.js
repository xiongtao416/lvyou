/**
 * Express 应用入口
 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const config = require('./config')
const responseHandler = require('./middleware/response')

// 初始化数据库（自动创建表）
require('./config/db')

const app = express()

// 中间件
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(responseHandler)

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')))
app.use('/static', express.static(path.join(__dirname, '../public/static')))
app.use(express.static(path.join(__dirname, '../public')))

// 路由
app.use('/api/home', require('./routes/home'))
app.use('/api/activities', require('./routes/activity'))
app.use('/api/registrations', require('./routes/registration'))
app.use('/api/users', require('./routes/user'))
app.use('/api/notes', require('./routes/note'))
app.use('/api/statistics', require('./routes/statistics'))

// 健康检查
app.get('/api/health', (req, res) => {
  res.success({ status: 'ok', time: new Date().toISOString() })
})

// API文档
app.get('/api', (req, res) => {
  res.success({
    name: '户外活动管理系统 API',
    version: '1.0.0',
    endpoints: {
      'GET /api/health': '健康检查',
      'GET /api/activities': '活动列表',
      'GET /api/activities/hot': '热门活动',
      'GET /api/activities/past': '往期活动',
      'GET /api/activities/:id': '活动详情',
      'POST /api/activities': '创建活动',
      'PUT /api/activities/:id': '更新活动',
      'DELETE /api/activities/:id': '删除活动',
      'GET /api/registrations': '报名列表',
      'POST /api/registrations': '创建报名',
      'PUT /api/registrations/:id/review': '审核报名',
      'GET /api/users': '用户列表',
      'GET /api/users/:id': '用户详情',
      'PUT /api/users/:id': '更新用户',
      'GET /api/notes': '游记列表',
      'GET /api/notes/:id': '游记详情',
      'POST /api/notes': '创建游记',
      'GET /api/statistics/overview': '统计概览',
      'GET /api/statistics/user-stats': '用户统计',
      'GET /api/statistics/activity-ranking': '活动排行'
    }
  })
})

// 404
app.use((req, res) => {
  res.fail('接口不存在', 404)
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.fail(err.message || '服务器内部错误', 500)
})

// 启动
app.listen(config.port, () => {
  console.log(`🚀 服务启动成功: http://localhost:${config.port}`)
  console.log(`📡 API文档: http://localhost:${config.port}/api`)
  console.log(`❤️  健康检查: http://localhost:${config.port}/api/health`)
})
