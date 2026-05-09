/**
 * 统一响应格式中间件
 */
const responseHandler = (req, res, next) => {
  res.success = (data, message = 'success') => {
    res.json({ code: 0, message, data })
  }

  res.fail = (message = 'fail', code = -1, data = null) => {
    res.json({ code, message, data })
  }

  res.pageSuccess = (list, total, page, pageSize) => {
    res.json({
      code: 0,
      message: 'success',
      data: { list, total, page, pageSize }
    })
  }

  next()
}

module.exports = responseHandler
