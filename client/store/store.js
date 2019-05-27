/*
 * @Description: 文件描述
 * @Author: qianxuemin001
 * @Date: 2018-12-16 19:22:22
 * @LastEditTime: 2019-05-27 23:21:05
 * @LastEditors: qianxuemin001
 */
import AppStateClass from './app-state'

export const AppState = AppStateClass
export default {
  AppState
}
export const createStoreMap = () => ({ // 专门给服务端渲染使用
  appState: new AppState()
})
