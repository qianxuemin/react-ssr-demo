import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './views/App.jsx'// eslint-disable-line
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'// eslint-disable-line

import appState from './store/app-state'
// 热更新组件包裹
const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={appState}>
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
