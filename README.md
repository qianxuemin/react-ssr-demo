# react 服务端渲染小栗子

## 概述
工程架构:webpack + node + 服务端渲染
项目架构: react + react-router + mobx + 服务端渲染优化
业务开发: cnode
项目部署:pm2 + nginx + 一键部署

## 启动步骤
npm run build
npm start

npm run dev:client
npm run dev:server

## 热更新配置Note
1. `devServer.hot = true`
2. plugins 添加webpack插件 `new webpack.HotModuleReplacementPlugin()`
3. 安装 `react-hot-loader@next`
4. .babelrc 添加配置 `"plugins":["react-hot-loader/babel"]`
5. 开发环境 entry增加 `react-hot-loader/patch`
6. 入口文件组件用`AppContainer`包裹
7. 注意 publicPath: '/public/' 的配置路径问题


## 思考
1. 工程搭建过程中会踩很多的坑，因为用到了非常多的工具，每个工具有自己特定的用法，如果有一步配置失败，找问题的过程都会非常困难，但是这是必须要经历的过程，只有走过这些坑，才能更好更快的解决工程中的问题