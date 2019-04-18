const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const proxy = require('http-proxy-middleware')

const serverConfig = require('../../build/webpack.config.server')
// 开发时从内存读取模板
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}
// 用于将string 转为 module
const Module = module.constructor
// 在内存中读写文件 而不是对硬盘操作 提高速度
const mfs = new MemoryFs()
// 通过读取webpack打包的结果获取server端bundle
const serverCompiler = webpack(serverConfig)
// 指定webpack配置项
serverCompiler.outputFileSystem = mfs
// 监听entry依赖的文件的变化  一旦有变化 会重新打包
let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))
  // 获取服务端bundle的路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
})

module.exports = function (app) {
  // 通过中间件代理的方式 把静态文件代理到dev-server启动的服务上
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
