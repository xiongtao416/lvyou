/**
 * 用户路由
 */
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/user')

router.get('/', ctrl.getList)         // 获取用户列表
router.get('/admins', ctrl.getAdminList)  // 获取管理员列表
router.get('/:id', ctrl.getById)      // 获取用户信息
router.put('/:id', ctrl.update)       // 更新用户信息

module.exports = router
