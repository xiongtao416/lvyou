/**
 * 报名控制器 - SQLite版
 */
const db = require('../config/database')

// 获取报名列表
exports.getList = (req, res) => {
  try {
    const { page, pageSize, activityId, status } = req.query
    let where = 'WHERE 1=1'
    const params = []
    if (activityId) { where += ' AND r.activityId = ?'; params.push(activityId) }
    if (status) { where += ' AND r.status = ?'; params.push(status) }

    const total = db.queryOne(`SELECT COUNT(*) as total FROM registrations r ${where}`, params).total
    const list = db.query(
      `SELECT r.*, a.title as activityTitle FROM registrations r LEFT JOIN activities a ON r.activityId = a.id ${where} ORDER BY r.createTime DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize) || 10, ((Number(page) || 1) - 1) * (Number(pageSize) || 10)]
    ).map(db.rowToObj)

    res.pageSuccess(list, total, Number(page) || 1, Number(pageSize) || 10)
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 创建报名
exports.create = (req, res) => {
  try {
    const { activityId, userName, userPhone, userCount = 1, remark, userId } = req.body

    // 检查活动
    const activity = db.findById('activities', activityId)
    if (!activity) return res.fail('活动不存在', 404)
    if (activity.status !== 'registering') return res.fail('活动不在报名中')
    if (activity.participantCount + userCount > activity.maxParticipants) return res.fail('报名人数已满')

    // 检查重复
    const exists = db.queryOne(
      "SELECT * FROM registrations WHERE activityId = ? AND userPhone = ? AND status != 'cancelled'",
      [activityId, userPhone]
    )
    if (exists) return res.fail('该手机号已报名此活动')

    const registration = db.create('registrations', {
      activityId, userId: userId || '', userName, userPhone,
      userAvatar: '', department: req.body.department || '',
      userCount, totalPrice: activity.price * userCount, remark, status: 'pending'
    })

    // 更新参与人数
    db.run('UPDATE activities SET participantCount = participantCount + ? WHERE id = ?', [userCount, activityId])

    res.success(registration, '报名成功')
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 审核报名
exports.review = (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const registration = db.update('registrations', id, { status })
    if (!registration) return res.fail('报名记录不存在', 404)

    if (status === 'cancelled') {
      db.run('UPDATE activities SET participantCount = participantCount - ? WHERE id = ?', [registration.userCount, registration.activityId])
    }

    res.success(registration, '审核完成')
  } catch (error) {
    res.fail(error.message, 500)
  }
}

// 获取我的报名
exports.getMyRegistrations = (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.fail('缺少用户ID')
    const list = db.query(
      'SELECT r.*, a.title, a.cover, a.startDate, a.location, a.price FROM registrations r LEFT JOIN activities a ON r.activityId = a.id WHERE r.userId = ? ORDER BY r.createTime DESC',
      [userId]
    ).map(db.rowToObj)
    res.success(list)
  } catch (error) {
    res.fail(error.message, 500)
  }
}
