/**
 * 首页路由
 */
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/home')

router.get('/banners', ctrl.getBanners)
router.get('/nav-items', ctrl.getNavItems)
router.get('/home-data', ctrl.getHomeData)

module.exports = router
