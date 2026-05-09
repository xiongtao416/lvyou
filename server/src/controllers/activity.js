/**
 * 活动控制器 - SQLite版
 */
const db = require('../config/database')

// 获取活动列表
exports.getList = (req, res) => {
  try {
    const { page, pageSize, status, keyword, location } = req.query
    const result = db.findAll('activities', { page, pageSize, status, keyword, location })
    res.pageSuccess(result.list, result.total, result.page, result.pageSize)
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 获取活动详情
exports.getById = (req, res) => {
  try {
    const { id } = req.params
    const activity = db.findById('activities', id)
    if (!activity) return res.fail('活动不存在', 404)

    // 浏览量+1
    db.run('UPDATE activities SET views = views + 1 WHERE id = ?', [id])
    activity.views += 1

    res.success(activity)
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 创建活动
exports.create = (req, res) => {
  try {
    const activity = db.create('activities', req.body)
    res.success(activity, '创建成功')
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 更新活动
exports.update = (req, res) => {
  try {
    const { id } = req.params
    const activity = db.update('activities', id, req.body)
    if (!activity) return res.fail('活动不存在', 404)
    res.success(activity, '更新成功')
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 删除活动
exports.remove = (req, res) => {
  try {
    const { id } = req.params
    db.remove('activities', id)
    res.success(null, '删除成功')
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 获取热门活动
exports.getHot = (req, res) => {
  try {
    const list = db.query(
      "SELECT * FROM activities WHERE status = 'registering' ORDER BY views DESC, participantCount DESC LIMIT 6"
    ).map(db.rowToObj)
    res.success(list)
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 获取往期活动
exports.getPast = (req, res) => {
  try {
    const list = db.query(
      "SELECT * FROM activities WHERE status IN ('completed', 'cancelled') ORDER BY createTime DESC LIMIT 4"
    ).map(db.rowToObj)
    res.success(list)
  } catch (error) {
    res.fail(error.message, 500)
  }
}
