const express = require('express')
const ReactSSR = require('react-dom/server')
const favicon = require('serve-favicon')

const bodyParser = require('body-parser')
const session = require('express-session')

const fs = require('fs')
// 引用文件最好使用绝对路径
const path = require('path')
// 判断当前执行环境
const isDev = process.env.NODE_ENV === 'development'
console.log('process2.env.NODE_ENV:', process.env.NODE_ENV)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000, // session 保持10分钟
  name: 'tid', // session放到浏览器端的cookieID
  resave: false, // 是否每次请求都要重新申请cookieID
  saveUninitialized: false,
  secret: 'react cnode class' // 用它去加密cookie，以确保cookie在浏览器端不能被解密
}))
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use('/api/user', require('./util/handle-login')) // cnode 登录
app.use('/api', require('./util/proxy')) // 请求代理到cnode
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
