/**
 * 统计控制器 - SQLite版
 */
const db = require('../config/database')

exports.getOverview = (req, res) => {
  try {
    const activities = db.queryOne("SELECT COUNT(*) as total FROM activities WHERE status != 'draft'").total
    const participants = db.queryOne("SELECT COALESCE(SUM(userCount), 0) as total FROM registrations WHERE status = 'confirmed'").total
    const views = db.queryOne("SELECT COALESCE(SUM(views), 0) as total FROM activities").total
    const revenue = db.queryOne("SELECT COALESCE(SUM(totalPrice), 0) as total FROM registrations WHERE status = 'confirmed'").total
    const pendingRegs = db.queryOne("SELECT COUNT(*) as total FROM registrations WHERE status = 'pending'").total

    res.success({ activities, participants, views, revenue, pendingRegistrations: pendingRegs })
  } catch (error) { res.fail(error.message, 500) }
}

exports.getUserStats = (req, res) => {
  try {
    const total = db.queryOne("SELECT COUNT(*) as total FROM users").total
    const newToday = db.queryOne("SELECT COUNT(*) as total FROM users WHERE date(createTime) = date('now', 'localtime')").total
    const active = db.queryOne("SELECT COUNT(*) as total FROM users WHERE status = 'active'").total
    res.success({ total, newToday, active })
  } catch (error) { res.fail(error.message, 500) }
}

exports.getActivityRanking = (req, res) => {
  try {
    const list = db.query('SELECT title, cover, participantCount as participants, views, price FROM activities ORDER BY views DESC, participantCount DESC LIMIT 10').map(db.rowToObj)
    res.success(list)
  } catch (error) { res.fail(error.message, 500) }
}
