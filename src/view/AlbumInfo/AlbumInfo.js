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
    this.playSong = this.playSong.bind(this)
    this.playAllSong = this.playAllSong.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    
    let mid = this.props.match.params.mid
    fetch.getAlbumInfo(mid)
      .then(async res => {
        let albumInfo = res.data
        let datas = await Promise.all(
          albumInfo.list.map(async (song) => {
            let vkeyData = await fetch.getSongVkey(song.songmid)
            let url = `http://dl.stream.qqmusic.qq.com/C400${song.songmid}.m4a?vkey=${vkeyData.data.items[0].vkey}&guid=3030549298&uin=772528797&fromtag=66`
            let albumpic = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`
            return Object.assign({}, song, {
              url,
              albumpic
            })
          })
        )
        albumInfo.list = datas
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

  playSong(songInfo) {
    this.props.playSong(Object.assign({}, {
      songid: songInfo.songid,
      url: songInfo.url,
      albumpic: songInfo.albumpic,
      name: songInfo.songname,
      currentDuration: 0,
      singer: this.handleSinger(songInfo.singer)
    }))
    this.props.setPlayStatus(1)
    
    let songList = []
    for (let [index, song] of Object.entries(this.state.albumInfo.list)) {
      songList.push(Object.assign({}, {
        songid: song.songid,
        url: song.url,
        albumpic: song.albumpic,
        name: song.songname,
        currentDuration: 0,
        singer: this.handleSinger(song.singer)
      }))
    }
    
    this.props.setSongList(songList)
  }

  playAllSong() {
    let songList = []
    for (let [index, song] of Object.entries(this.state.albumInfo.list)) {
      songList.push(Object.assign({}, {
        songid: song.songid,
        url: song.url,
        albumpic: song.albumpic,
        name: song.songname,
        currentDuration: 0,
        singer: this.handleSinger(song.singer)
      }))
    }
    
    this.props.setSongList(songList)

    this.props.playSong(songList[0])
    this.props.setPlayStatus(1)
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
                <span className="play-all-btn" onClick={this.playAllSong}>播放全部</span>
              </div>
            </section>
            <section className="album-song-list-section">
              <p className="album-song-list-title">专辑<span className="song-num">共{this.state.albumInfo.total}首</span></p>
              <ul className="album-song-list">
                {
                  this.state.albumInfo.list.map((val, index) => (
                    <li className="album-song-item" key={val.songid} onClick={() => this.playSong(val)}>
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
