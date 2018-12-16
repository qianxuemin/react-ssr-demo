import {
  observable,
  computed,
  autorun,
  action
} from 'mobx'

export class AppState {
 @observable count = 0 // 声明state是可被观察的
 @observable name = 'qxm'
 @computed get msg () { // 不需要调用方法 直接获取值
   return `${this.name} say count is : ${this.count} `
 }
 @action add () {
   this.count += 1
 }
 @action changeName (name) {
   this.name = name
 }
}

const appState = new AppState()

// 一旦 appState 有更新 自动执行
autorun(() => {
  console.log(appState.msg)
})

// setInterval(() => {
//   appState.add()
// }, 1000)

export default appState
