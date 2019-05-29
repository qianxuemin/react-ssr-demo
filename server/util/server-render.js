const ReactDomServer = require('react-dom/server')
const asyncBootStrap = require('react-async-bootstrapper') // commonjs2
const ejs = require('ejs')
const serialize = require('serialize-javascript')
// export import模式写的代码
const Helmet = require('react-helmet').default// tdk帮助组件

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const app = createApp(stores, routerContext, req.url)
    asyncBootStrap(app).then(() => {
      // 拿到异步数据之后
      if (routerContext.url) { // 如果有redirect 直接在服务端处理redirect
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      console.log('stores=', stores.appState.count)
      const helmet = Helmet.rewind()

      // 服务端获取的需要 需要同步给客户端
      const state = getStoreState(stores)
      const content = ReactDomServer.renderToString(app)
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString()
      })
      res.send(html)
      resolve()
      // res.send(template.replace('<!-- app -->', content))
    }).catch(reject)
  })
}
