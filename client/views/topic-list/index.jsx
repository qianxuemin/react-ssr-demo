import React from 'react'
import PropTypes from 'prop-types'
import {
  observer,
  inject
} from 'mobx-react'
import AppState from '../../store/app-state'
// 注入state到组件 同时声明组件时observable的（值更新 组件也更新）

@inject('appState')
@observer
class TopicList extends React.Component {
  constructor () {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount () {
    // dosomething
  }

  bootstrap () {
    console.log(122)
    return new Promise((resolve) => {
      setTimeout(() => { // eslint-disable-line
        console.log(133)
        this.props.appState.count = 3 // eslint-disable-line
        console.log(134)
        resolve(true) // 最后一定要 resolve(true) 决定方法是否执行成功
      }, 1000)
    })
  }
  changeName (event) {
    const { appState } = this.props
    appState.changeName(event.target.value)
  }

  render () {
    const { appState } = this.props
    return (
      <div>
        <input type='text' onChange={this.changeName} />
        <p>This is topic list</p>
        <p>{appState.msg}</p>
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(new AppState())
}

export default TopicList
