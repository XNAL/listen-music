import React, { Component } from 'react'
import './Search.scss'
// import fetch from '../../fetch/index'

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount () {

  }


  render() {
    return (
      <section className="search-section">
        <div className="search-input-container">
          <i className="iconfont icon-search" />
          <input type="text" className="search-input" placeholder="搜索歌曲、歌手、歌单、专辑" />
        </div>
      </section>
    )
  }
}
