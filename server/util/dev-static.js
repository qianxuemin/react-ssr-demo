/*
 * @Description: 文件描述
 * @Author: qianxuemin001
 * @Date: 2018-12-16 13:13:27
 * @LastEditTime: 2019-05-30 00:17:06
 * @LastEditors: qianxuemin001
 */
const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs')

const proxy = require('http-proxy-middleware')

const serverConfig = require('../../build/webpack.config.server')

const serverRender = require('./server-render')
// 开发时从内存读取模板
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}
const NativeModule = require('module')
const vm = require('vm')
// 通过自定义m 代码执行完后会把
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  // wrap方法可以把代码包装成 (function(export,require,modele__filename,__dirname){ ...bundle code}) 的形式
  const wrapper = NativeModule.wrap(bundle)
  // 执行包装之后的js代码
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  // 指定执行环境
  const result = script.runInThisContext()
  // 代码执行时指定调用者是m.exports 这样可以让实际代码执行完后把modeule.exports的代码赋在m.exports上
  result.call(m.exports, m.exports, require, m)
  return m
}

// 用于将string 转为 module
// const Module = module.constructor
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
  // 下面这张方式无法使用require的方式从node_modules引用包
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js')// 第二个参数指定bundle文件的名字
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function (app) {
  // 通过中间件代理的方式 把静态文件代理到dev-server启动的服务上 内存中读取静态资源
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('稍等 在编译 马上刷新')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
