/**
 * 游记控制器 - SQLite版
 */
const db = require('../config/database')

exports.getList = (req, res) => {
  try {
    const result = db.findAll('notes', { page: req.query.page, pageSize: req.query.pageSize, status: req.query.status, keyword: req.query.keyword })
    res.pageSuccess(result.list, result.total, result.page, result.pageSize)
  } catch (error) { res.fail(error.message, 500) }
}

exports.getById = (req, res) => {
  try {
    const note = db.findById('notes', req.params.id)
    if (!note) return res.fail('游记不存在', 404)
    db.run('UPDATE notes SET views = views + 1 WHERE id = ?', [req.params.id])
    note.views += 1
    res.success(note)
  } catch (error) { res.fail(error.message, 500) }
}

exports.create = (req, res) => {
  try {
    const note = db.create('notes', req.body)
    res.success(note, '创建成功')
  } catch (error) { res.fail(error.message, 500) }
}

exports.review = (req, res) => {
  try {
    const note = db.update('notes', req.params.id, { status: req.body.status })
    if (!note) return res.fail('游记不存在', 404)
    res.success(note, '审核完成')
  } catch (error) { res.fail(error.message, 500) }
}
