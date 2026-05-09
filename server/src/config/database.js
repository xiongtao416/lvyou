/**
 * 数据库工具函数
 * 封装SQLite操作，提供类似Mongoose的API
 */
const db = require('./db')
const { v4: uuidv4 } = require('uuid')

/**
 * 解析JSON字段
 */
const parseJSON = (str) => {
  try { return typeof str === 'string' ? JSON.parse(str) : (str || []) }
  catch { return [] }
}

/**
 * 序列化为JSON字符串
 */
const toJSON = (obj) => JSON.stringify(obj || [])

/**
 * 将数据库行转换为API响应对象
 */
const rowToObj = (row) => {
  if (!row) return null
  const obj = { ...row }
  // 解析JSON字段
  const jsonFields = ['images', 'tags', 'feeInclude', 'feeExclude', 'itinerary', 'notices', 'participants', 'organizer', 'stats', 'images']
  jsonFields.forEach(field => {
    if (obj[field] !== undefined) {
      obj[field] = parseJSON(obj[field])
    }
  })
  return obj
}

/**
 * 通用查询
 */
const findAll = (table, { page = 1, pageSize = 10, status, keyword, location, orderBy = 'createTime DESC' } = {}) => {
  let where = 'WHERE 1=1'
  const params = []

  if (status) { where += ' AND status = ?'; params.push(status) }
  if (keyword) { where += ' AND title LIKE ?'; params.push(`%${keyword}%`) }
  if (location) { where += ' AND location LIKE ?'; params.push(`%${location}%`) }

  const countSQL = `SELECT COUNT(*) as total FROM ${table} ${where}`
  const total = db.prepare(countSQL).get(...params).total

  const dataSQL = `SELECT * FROM ${table} ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
  const rows = db.prepare(dataSQL).all(...params, pageSize, (page - 1) * pageSize)

  return { list: rows.map(rowToObj), total, page: Number(page), pageSize: Number(pageSize) }
}

/**
 * 根据ID查询
 */
const findById = (table, id) => {
  const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id)
  return rowToObj(row)
}

/**
 * 创建记录
 */
const create = (table, data) => {
  const id = uuidv4()
  data.id = id
  data.createTime = new Date().toISOString()
  data.updateTime = new Date().toISOString()

  // 序列化JSON字段
  const jsonFields = ['images', 'tags', 'feeInclude', 'feeExclude', 'itinerary', 'notices', 'participants', 'organizer', 'stats']
  jsonFields.forEach(field => {
    if (data[field] !== undefined) data[field] = toJSON(data[field])
  })

  const fields = Object.keys(data).join(', ')
  const placeholders = Object.keys(data).map(() => '?').join(', ')
  const values = Object.values(data)

  db.prepare(`INSERT INTO ${table} (${fields}) VALUES (${placeholders})`).run(...values)
  return findById(table, id)
}

/**
 * 更新记录
 */
const update = (table, id, data) => {
  data.updateTime = new Date().toISOString()

  // 序列化JSON字段
  const jsonFields = ['images', 'tags', 'feeInclude', 'feeExclude', 'itinerary', 'notices', 'participants', 'organizer', 'stats']
  jsonFields.forEach(field => {
    if (data[field] !== undefined) data[field] = toJSON(data[field])
  })

  const sets = Object.keys(data).map(k => `${k} = ?`).join(', ')
  const values = [...Object.values(data), id]

  db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...values)
  return findById(table, id)
}

/**
 * 删除记录
 */
const remove = (table, id) => {
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id)
}

/**
 * 执行原生SQL
 */
const query = (sql, params = []) => {
  return db.prepare(sql).all(...params)
}

const queryOne = (sql, params = []) => {
  return db.prepare(sql).get(...params)
}

const run = (sql, params = []) => {
  return db.prepare(sql).run(...params)
}

module.exports = {
  findAll, findById, create, update, remove,
  query, queryOne, run, rowToObj, parseJSON, toJSON
}
