import React, { Component } from 'react'
import './Search.scss'
import fetch from '../../fetch/index'
import storage from '../../util/storage'

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      searchKey: '',
      hotKeys: [],
      searchHistory: [],
      special_key: '',
      special_url: ''
    }
    this.cancelInput = this.cancelInput.bind(this)
    this.inputOnFocus = this.inputOnFocus.bind(this)
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
    
    this.setState({
      searchHistory: storage.getSearchHistory()
    })
  }

  componentWillUnmount () {

  }

  cancelInput () {
    this.setState({
      focus: false
    })
  }

  inputOnFocus () {
    this.setState({
      focus: true
    })
  }

  handleSearchInput (e) {
    this.setState({
      searchKey: e.target.value
    })
  }

  render() {
    return (
      <section className="search-section">
        <div className="search-input-container">
          <i className="iconfont icon-search" />
          <input ref="refInput" 
            type="text"
            onChange={this.handleSearchInput}
            className={"search-input " + (this.state.focus ? 'focus' : '')}
            placeholder="搜索歌曲、歌手、歌单、专辑"
            onFocus={this.inputOnFocus} />
          <span className={"cancel-text " + (this.state.focus ? 'show' : '')} onClick={this.cancelInput}>取消</span>
        </div>
        <div className="hot-key-container">
          <h2 className="hot-key-title">热门搜索</h2>
          {
            this.state.special_key && 
            <div className="hot-key-item special" key={this.state.special_key}>
              <a href={this.state.special_url}>{this.state.special_key}</a>
            </div>
          }
          {
            this.state.hotKeys.map((key, index) => (
              <div className="hot-key-item" key={index}>{key.k}</div>
            ))
          }
        </div>
        {
          this.state.focus &&
          <div className="search-history-container">
            <ul className="search-history-list">
              {
                this.state.searchHistory.map((key, index) => (
                  <li className="search-history-item" key={index}>
                    <i className="iconfont icon-history" />
                    <span className="history-key">{key}</span>
                    <i className="iconfont icon-delete" />
                  </li>
                ))
              }
            </ul>
          </div>
        }
      </section>
    )
  }
}
