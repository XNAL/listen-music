import React, { Component } from 'react'
import './AlbumInfo.scss'
import fetch from '../../fetch/index'

export default class AlbumInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albumInfo: null
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    
    let mid = this.props.match.params.mid
    fetch.getAlbumInfo(mid)
      .then(res => {
        this.setState({
          albumInfo: res.data
        })
      })
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll (event) {
    let scrollTop = document.body.scrollTop | document.documentElement.scrollTop
    if (scrollTop >= 144) {
      this.refs.infoBoxRef.style.position = 'fixed'
      this.refs.infoBoxRef.style.top = '-144px'
    } else {
      this.refs.infoBoxRef.style.position = 'relative'
      this.refs.infoBoxRef.style.top = '0'
    }
  }

  handleSinger(singers) {
    let formatSingers = []
    for (let singer of Object.values(singers)) {
      formatSingers.push(singer.name)
    }
    return formatSingers.join(' / ')
  }

  render() {
    const isExistData = this.state.albumInfo !== null
    if (isExistData) {
      return (
          <section className="album-info">
            <section className="album-info-box" ref="infoBoxRef">
              <section className="album-info-section">
                <div className="album-info-cover">
                  <img src={`https://y.gtimg.cn/music/photo_new/T002R150x150M000${this.state.albumInfo.mid}.jpg?max_age=2592000`} alt="专辑图片" />
                </div>
                <div className="album-info-name-author">
                  <h1 className="album-info-name">{this.state.albumInfo.name}</h1>
                  <div className="album-info-author">
                    <img className="author-avatar" src={`https://y.gtimg.cn/music/photo_new/T001R150x150M000${this.state.albumInfo.singermid}.jpg?max_age=2592000`} alt="歌手图片" />
                    <div className="author-name">
                      <span>{this.state.albumInfo.singername}</span>
                    </div>
                  </div>
                  <p className="album-info-time">发行时间：{this.state.albumInfo.aDate}</p>
                </div>
              </section>
              <img className="album-info-backImg" src={`https://y.gtimg.cn/music/photo_new/T002R150x150M000${this.state.albumInfo.mid}.jpg?max_age=2592000)`} alt="专辑图片" />
              <div className="opt-box">
                <span className="play-all-btn">播放全部</span>
              </div>
            </section>
            <section className="album-song-list-section">
              <p className="album-song-list-title">专辑<span className="song-num">共{this.state.albumInfo.total}首</span></p>
              <ul className="album-song-list">
                {
                  this.state.albumInfo.list.map((val, index) => (
                    <li className="album-song-item" key={val.songid}>
                      <div className="album-song-order">{index + 1}</div>
                      <div className="album-song-info">
                        <h3 className="album-song-name txt-nowrap">{val.songname}</h3>
                        <p className="album-song-singer txt-nowrap">{this.handleSinger(val.singer)}</p>
                      </div>
                    </li>
                  ))
                }
                
              </ul>
            </section>
            {
              this.state.albumInfo.desc !== '' &&
              <section className="album-desc">
                <h2 className="album-desc-title">专辑简介</h2>
                <p className="album-desc-content">{this.state.albumInfo.desc}</p>
              </section>
            }
          </section>
      )
    } else {
      return (<div />)
    }
  }
}
