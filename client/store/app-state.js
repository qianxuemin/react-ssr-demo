/*
 * @Description: 文件描述
 * @Author: qianxuemin001
 * @Date: 2018-12-16 20:59:17
 * @LastEditTime: 2019-05-27 23:49:38
 * @LastEditors: qianxuemin001
 */
import {
  observable,
  computed,
  // autorun,
  action
} from 'mobx'

export default class AppState {
  constructor ({ count, name } = { count: 0, name: 'qxm' }) {
    this.count = count
    this.name = name
  }
 @observable count // 声明state是可被观察的
 @observable name
 @computed get msg () { // 不需要调用方法 直接获取值
   return `${this.name} say count is : ${this.count} `
 }
 @action add () {
   this.count += 1
 }
 @action changeName (name) {
   this.name = name
 }
 toJson () { // 将app-state在服务端渲染后拿到的数据以json格式获取到
   return {
     count: this.count,
     name: this.name
   }
 }
}

// const appState = new AppState()

// 一旦 appState 有更新 自动执行
// autorun(() => {
//   console.log(appState.msg)
// })

// setInterval(() => {
//   appState.add()
// }, 1000)

// export default appState
