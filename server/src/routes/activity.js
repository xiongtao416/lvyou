/**
 * 活动路由
 */
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/activity')

router.get('/', ctrl.getList)           // 获取活动列表
router.get('/hot', ctrl.getHot)         // 获取热门活动
router.get('/past', ctrl.getPast)       // 获取往期活动
router.get('/:id', ctrl.getById)        // 获取活动详情
router.post('/', ctrl.create)           // 创建活动
router.put('/:id', ctrl.update)         // 更新活动
router.delete('/:id', ctrl.remove)      // 删除活动

module.exports = router
