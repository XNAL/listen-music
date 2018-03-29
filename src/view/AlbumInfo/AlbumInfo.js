import React, { Component } from 'react'
import './AlbumInfo.scss'
import fetch from '../../fetch/index'

export default class AlbumInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albumInfo: {
        list: []
      }
    }
  }

  componentDidMount() {
    let mid = this.props.match.params.mid
    fetch.getAlbumInfo(mid)
      .then(res => {
        this.setState({
          albumInfo: res.data
        })
      })
  }

  handleSinger(singers) {
    let formatSingers = []
    for (let singer of Object.values(singers)) {
      formatSingers.push(singer.name)
    }
    return formatSingers.join(' / ')
  }

  render() {
    return (
      <section className="album-info">
        <section className="album-info-box">
          <section className="album-info-section">
            <div className="album-info-cover">
              <img src={`https://y.gtimg.cn/music/photo_new/T002R150x150M000${this.state.albumInfo.mid}.jpg?max_age=2592000`} alt="专辑图片" />
            </div>
            <div className="album-info-name-author">
              <p className="album-info-name">{this.state.albumInfo.name}</p>
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
            <a className="play-all-btn" href="javascript;;">播放全部</a>
          </div>
        </section>
        <section className="album-song-list-section">
          <p className="album-song-list-title">专辑</p>
          <ul className="album-song-list">
            {
              this.state.albumInfo.list.map(val => (
                <li className="album-song-item" key={val.songid}>
                  <p className="album-song-name">{val.songname}</p>
                  <p className="album-song-singer">{this.handleSinger(val.singer)}</p>
                </li>
              ))
            }
            
          </ul>
        </section>
      </section>
    )
  }
}
