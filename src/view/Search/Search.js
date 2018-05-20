import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
      special_url: '',
      searchResult: [],
      viewPortHeight: document.documentElement.clientHeight - 142,
      page: 1,
      isEnd: false,
      isLoading: false
    }
    this.cancelInput = this.cancelInput.bind(this)
    this.inputOnFocus = this.inputOnFocus.bind(this)
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.search = this.search.bind(this)
    this.deleteSearchHistory = this.deleteSearchHistory.bind(this)
    this.clearSearchHistory = this.clearSearchHistory.bind(this)
    this.handleSinger = this.handleSinger.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleClickSearch = this.handleClickSearch.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
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
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll (event) {
    let scrollTop = document.body.scrollTop | document.documentElement.scrollTop
    if (this.refs.resultRef) {
      let listHeight = this.refs.resultRef.clientHeight
      if ((listHeight - this.state.viewPortHeight - scrollTop <= 100) && !this.state.isEnd && !this.state.isLoading) {
        let page = this.state.page
        page ++
        this.setState({
          isLoading: true,
          page: page
        }, () => {
          this.fetchSearch()
        })
      }
    }
  }
  
  fetchSearch () {
    fetch.searchByKey(this.state.searchKey, this.state.page)
      .then(res => {
        let isEnd = false
        let resultSong = res.data.song
        let searchResult = this.state.searchResult
        if (this.state.page === 1 && res.data.zhida && (res.data.zhida.type === 2 || res.data.zhida.type === 3) ) {
          searchResult.push(Object.assign(res.data.zhida, {
            isLink: true
          }))
        }
        if (resultSong.list && resultSong.list.length > 0) {
          searchResult = searchResult.concat(resultSong.list)
        }
        if (resultSong.curnum * resultSong.curpage >= resultSong.totalnum) {
          isEnd = true
        }
        this.setState({
          isLoading: false,
          isEnd: isEnd,
          searchResult: searchResult
        })
      })
  }

  search (e) {
    if (e.key === 'Enter') {
      this.setSearchHistory()
      this.setState({
        page: 1
      }, () => {
        this.fetchSearch()
      })
    }
  }

  cancelInput () {
    this.setState({
      searchResult: [],
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

  setSearchHistory () {
    let searchKey = this.state.searchKey
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

  handleClickSearch (keyword) {
    this.setState({
      searchResult: [],
      searchKey: keyword,
      focus: true,
      isLoading: true,
      page: 1
    }, () => {
      this.setSearchHistory()
      this.fetchSearch()
    })
  }

  deleteSearchHistory (e, index) {
    e.stopPropagation()
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

  // 处理歌手数据
  handleSinger(singers) {
    let formatSingers = []
    for (let singer of Object.values(singers)) {
      formatSingers.push(singer.name)
    }
    return formatSingers.join(' / ')
  }

  render() {
    let searchResultArray = []
    this.state.searchResult.forEach((result, index) => {
      if (result.isLink) {
        if (result.type === 2) {
          searchResultArray.push(
            <li className="search-result-item" key={index}>
              <Link to={`/SingerInfo/${result.singerid}`} className="singer-jump">
              <img className="singer-img" src={`https://y.gtimg.cn/music/photo_new/T001R68x68M000${result.singermid}.jpg?max_age=2592000`}></img>
                <p className="search-result-item-name">{result.singername}</p>
                <p className="data-list">
                   <span className="data-item">单曲：{result.songnum}</span>
                   <span className="data-item">专辑：{result.albumnum}</span>
                </p>
              </Link>
            </li>
          )
        } else if (result.type === 3) {
          searchResultArray.push(
            <li className="search-result-item" key={index}>
              <Link to={`/AlbumInfo/${result.albummid}`} className="singer-jump">
              <img className="album-img" src={`https://y.gtimg.cn/music/photo_new/T002R68x68M000${result.albummid}.jpg?max_age=2592000`}></img>
                <p className="search-result-item-name">{result.albumname}</p>
                <p className="search-result-item-singer">{result.singername}</p>
              </Link>
            </li>
          )
        }
      } else {
        console.log(result)
        searchResultArray.push(
          <li className="search-result-item" key={index}>
            <i className="iconfont icon-music" />
            <p className="search-result-item-name">{result.songname}</p>
            <p className="search-result-item-singer">{this.handleSinger(result.singer)}</p>
          </li>
        )
      }
    })
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
              <div className="hot-key-item" key={index}  onClick={() => this.handleClickSearch(key.k)}>{key.k}</div>
            ))
          }
        </div>
        {
          !this.state.isLoading && this.state.focus &&
          <div className="search-history-container">
            <ul className="search-history-list">
              {
                this.state.searchHistory.map((result, index) => (
                  <li className="search-history-item" key={index} onClick={() => this.handleClickSearch(result)}>
                    <i className="iconfont icon-history" />
                    <span className="history-key">{result}</span>
                    <i className="iconfont icon-delete" onClick={(e) => this.deleteSearchHistory(e, index)}/>
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
        {
          this.state.focus && this.state.searchResult.length > 0 &&
          <div className="search-reuslt-container">
            <ul className="search-result-list" ref="resultRef">
              { searchResultArray }
            </ul>
        </div>
        }
      </section>
    )
  }
}
