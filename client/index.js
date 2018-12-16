import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { AppContainer } from 'react-hot-loader'

// 热更新组件包裹
const root = document.getElementById('root')
const render = Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
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
  module.hot.accept('./App.jsx', () => {
    // commonjs2 规范
    const NextApp = require('./App.jsx').default
    // ReactDOM.hydrate(<NextApp />, document.getElementById('root'))
    render(NextApp)
  })
}
