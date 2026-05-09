/**
 * 报名路由
 */
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/registration')

router.get('/', ctrl.getList)               // 获取报名列表
router.get('/my', ctrl.getMyRegistrations)  // 获取我的报名
router.post('/', ctrl.create)               // 创建报名
router.put('/:id/review', ctrl.review)      // 审核报名

module.exports = router
