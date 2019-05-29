/*
 * @Description: 文件描述
 * @Author: qianxuemin001
 * @Date: 2018-12-16 00:41:38
 * @LastEditTime: 2019-05-28 12:19:15
 * @LastEditors: qianxuemin001
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'// eslint-disable-line
import App from './views/App.jsx'// eslint-disable-line

import AppState from './store/app-state'

const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

// 热更新组件包裹
const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
  )
}

// ReactDOM.render(<App />, document.getElementById('root'))
// react 16 新加的方法 react会去对比服务端生成的代码与客户端生成的代码
// ReactDOM.hydrate(<App />, document.getElementById('root'))
render(App)
// 热更新
if (module.hot) {
  module.hot.accept('./views/App.jsx', () => {
    // commonjs2 规范
    const NextApp = require('./views/App.jsx').default // eslint-disable-line

    // ReactDOM.hydrate(<NextApp />, document.getElementById('root'))
    render(NextApp)
  })
}
