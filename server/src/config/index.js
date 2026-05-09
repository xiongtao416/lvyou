/**
 * 应用配置
 */
require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key',
  uploadPath: process.env.UPLOAD_PATH || './data/uploads',
  // 允许跨域的前端地址
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080'
}
