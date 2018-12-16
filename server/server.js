const express = require('express')
const ReactSSR = require('react-dom/server')

const fs = require('fs')
// 引用文件最好使用绝对路径
const path = require('path')
// 判断当前执行环境
const isDev = process.env.NODE_ENV === 'development'

const app = express()

// 如果不是开发环境
if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  // 同步读取模板
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
  // 用于区分返回静态资源还是服务端渲染的代码
  app.use('/public', express.static(path.join(__dirname, '../dist')))

  console.log('serverEntry=====>', serverEntry)
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)

    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}
app.listen(3333, function () {
  console.log('server is listening on 3333')
})
