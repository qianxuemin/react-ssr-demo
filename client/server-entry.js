/*
 * @Description: 文件描述
 * @Author: qianxuemin001
 * @Date: 2018-12-16 01:21:28
 * @LastEditTime: 2019-05-26 23:05:14
 * @LastEditors: qianxuemin001
 */
// 服务端没有document对象
import React from 'react'
import { StaticRouter } from 'react-router-dom' // 服务端渲染使用
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App.jsx'// eslint-disable-line

import { createStoreMap } from './store/store'

useStaticRendering(true) // 使用静态渲染,让mobx在服务端渲染的时候不会重复数据变化

export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)
export { createStoreMap }
