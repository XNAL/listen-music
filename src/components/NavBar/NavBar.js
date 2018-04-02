import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.scss'

export default class NavBar extends Component {
  render() {
    return (
      <ul className="nav-bar-list">
        <li className="nav-bar-item">
          <NavLink exact to="/" activeClassName="active">推荐</NavLink>
        </li>
        <li className="nav-bar-item">
          <NavLink to="/Singer" activeClassName="active">歌手</NavLink>
        </li>
        <li className="nav-bar-item">
          <NavLink to="/Rank" activeClassName="active">排行榜</NavLink>
        </li>
      </ul>
    )
  }
}
