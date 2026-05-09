/**
 * 游记路由
 */
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/note')

router.get('/', ctrl.getList)              // 获取游记列表
router.get('/:id', ctrl.getById)           // 获取游记详情
router.post('/', ctrl.create)              // 创建游记
router.put('/:id/review', ctrl.review)     // 审核游记

module.exports = router
