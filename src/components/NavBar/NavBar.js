import React, { Component } from 'react'
import './NavBar.scss'

export default class NavBar extends Component {
  render() {
    return (
      <ul className="nav-bar-list">
        <li className="nav-bar-item active">推荐</li>
        <li className="nav-bar-item">歌手</li>
        <li className="nav-bar-item">排行榜</li>
      </ul>
    )
  }
}
