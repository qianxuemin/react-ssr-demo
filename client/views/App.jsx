import React from 'react'
import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends React.Component {
  componentDidMount () {
    // dosomething
  }
  render () {
    return [
      <div key='banner'>
        <Link to='/'>首页</Link>
        <br />
        <Link to='/detail'>详情页</Link>
        <br />
        <Link to='/test'>test</Link>
      </div>,
      <div key='test'> this is app </div>,
      <Routes key='routers' />
    ]
  }
}
