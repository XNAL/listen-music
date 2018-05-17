import React, { Component } from 'react'
import './Search.scss'
import fetch from '../../fetch/index'

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hotKeys: [],
      special_key: '',
      special_url: ''
    }
  }

  componentDidMount() {
    fetch.getHotKey()
      .then(res => {
        this.setState({
          special_key: res.data.special_key,
          special_url: res.data.special_url,
          hotKeys: res.data.hotkey.splice(0, res.data.special_key ? 9 : 10)
        })
      })
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
        <div className="hot-key-container">
          <h2 className="hot-key-title">热门搜索</h2>
          {
            this.state.special_key && 
            <div className="hot-key-item special" key={this.state.special_key}>
              <a href={this.state.special_url}> {this.state.special_key}</a>
            </div>
          }
          {
            this.state.hotKeys.map((key, index) => (
              <div className="hot-key-item" key={index}>{key.k}</div>
            ))
          }
        </div>
      </section>
    )
  }
}
