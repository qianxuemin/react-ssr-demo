const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

// 判断当前执行环境
const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/index.js')
  },
  output: {
    filename: '[name].[hash].js'
  },

  // 使用template模板
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]

})

// 如果是开发环境 增加配置
if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch', // 开发环境热更新代码用到
      path.join(__dirname, '../client/index.js')
    ]
  }
  config.devtool = 'source-map'
  config.devServer = {
    host: '0.0.0.0', // 代表本机任意ip
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    hot: true, // 开启热重载
    overlay: { // 错误类型信息在页面中显示
      errors: true
    },
    publicPath: '/public', // 表明访问静态资源都要通过/public
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }

  // 热更新配置
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
