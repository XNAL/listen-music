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
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.search = this.search.bind(this)
    this.deleteSearchHistory = this.deleteSearchHistory.bind(this)
    this.clearSearchHistory = this.clearSearchHistory.bind(this)
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
      searchHistory: storage.getSearchHistory() || []
    })
  }

  componentWillUnmount () {

  }

  cancelInput () {
    this.setState({
      searchKey: '',
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

  search (e) {
    if (e.key === 'Enter') {
      let searchKey = this.state.searchKey
      this.setState({
        searchKey: ''
      })
      this.setSearchHistory(searchKey)
      fetch.searchByKey(searchKey, this.state.page)
        .then(res => {
          console.log('res', res)
        })
    }
  }

  setSearchHistory (searchKey) {
    let searchList = this.state.searchHistory
    let index = searchList.findIndex((value) => {
      return value === searchKey
    })
    if (index !== -1) {
      searchList.splice(index, 1)
    }
    searchList.unshift(searchKey)
    this.setState({
      searchHistory: searchList
    })
    storage.setSearchHistory(searchList)
  }

  deleteSearchHistory (index) {
    let searchList = this.state.searchHistory
    searchList.splice(index, 1)
    this.setState({
      searchHistory: searchList
    })
    storage.setSearchHistory(searchList)
  }

  clearSearchHistory () {
    this.setState({
      searchHistory: []
    })
    storage.setSearchHistory([])
  }

  render() {
    return (
      <section className="search-section">
        <div className="search-input-container">
          <i className="iconfont icon-search" />
          <input ref="refInput" 
            type="text"
            value={this.state.searchKey}
            onChange={this.handleSearchInput}
            className={"search-input " + (this.state.focus ? 'focus' : '')}
            placeholder="搜索歌曲、歌手、歌单、专辑"
            onFocus={this.inputOnFocus}
            onKeyPress={this.search} />
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
                    <i className="iconfont icon-delete" onClick={(index) => this.deleteSearchHistory(index)}/>
                  </li>
                ))
              }
            </ul>
            {
              this.state.searchHistory.length > 0 && 
              <p className="clear-history" onClick={this.clearSearchHistory}>清除搜索记录</p>
            }
          </div>
        }
      </section>
    )
  }
}
