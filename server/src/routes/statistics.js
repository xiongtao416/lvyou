/**
 * 统计路由
 */
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/statistics')

router.get('/overview', ctrl.getOverview)        // 概览数据
router.get('/user-stats', ctrl.getUserStats)     // 用户统计
router.get('/activity-ranking', ctrl.getActivityRanking)  // 活动排行

module.exports = router
