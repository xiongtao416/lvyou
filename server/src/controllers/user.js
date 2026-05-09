/**
 * 用户控制器 - SQLite版
 */
const db = require('../config/database')

exports.getById = (req, res) => {
  try {
    const user = db.findById('users', req.params.id)
    if (!user) return res.fail('用户不存在', 404)
    res.success(user)
  } catch (error) { res.fail(error.message, 500) }
}

exports.update = (req, res) => {
  try {
    const user = db.update('users', req.params.id, req.body)
    if (!user) return res.fail('用户不存在', 404)
    res.success(user, '更新成功')
  } catch (error) { res.fail(error.message, 500) }
}

exports.getList = (req, res) => {
  try {
    const { page, pageSize, role, keyword } = req.query
    let where = 'WHERE 1=1'
    const params = []
    if (role) { where += ' AND role = ?'; params.push(role) }
    if (keyword) { where += ' AND (nickname LIKE ? OR name LIKE ? OR phone LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`) }

    const total = db.queryOne(`SELECT COUNT(*) as total FROM users ${where}`, params).total
    const list = db.query(
      `SELECT * FROM users ${where} ORDER BY createTime DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize) || 10, ((Number(page) || 1) - 1) * (Number(pageSize) || 10)]
    ).map(db.rowToObj)
    res.pageSuccess(list, total, Number(page) || 1, Number(pageSize) || 10)
  } catch (error) { res.fail(error.message, 500) }
}

exports.getAdminList = (req, res) => {
  try {
    const list = db.query("SELECT * FROM users WHERE role IN ('admin', 'super_admin')").map(db.rowToObj)
    res.success(list)
  } catch (error) { res.fail(error.message, 500) }
}
