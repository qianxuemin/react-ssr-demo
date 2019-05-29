const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  // dependencies中的模块在node环境中可以直接require引用 不用打包
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js', // 用于区分返回静态资源还是服务端渲染的代码
    libraryTarget: 'commonjs2'
  }
})
