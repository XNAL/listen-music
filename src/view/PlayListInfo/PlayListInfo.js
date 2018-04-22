import React, { Component } from 'react'
import './PlayListInfo.scss'
import fetch from '../../fetch/index'

export default class PlayListInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      playListInfo: null,
      pageIndex: 0,
      isNoMore: false
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.playSong = this.playSong.bind(this)
    this.playAllSong = this.playAllSong.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    
    this.setState({
      id: this.props.match.params.id
    }, () => {
      this.loadMore()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll);
  }

  loadMore () {
    fetch.getPlayListInfo(this.state.id, this.state.pageIndex)
      .then(async res => {
        let cdlist = res.data.data.cdlist[0]
        let songList = []
        let isNoMore = false
        if (this.state.playListInfo && this.state.playListInfo.songlist) {
          songList = this.state.playListInfo.songlist
        }
        if (songList.length + cdlist.songlist.length === cdlist.total_song_num) {
          isNoMore = true
        }
        let datas = await Promise.all(
          cdlist.songlist.map(async (song) => {
            let vkeyData = await fetch.getSongVkey(song.mid)
            let url = `http://dl.stream.qqmusic.qq.com/C400${song.mid}.m4a?vkey=${vkeyData.data.items[0].vkey}&guid=3030549298&uin=772528797&fromtag=66`
            let albumpic = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg?max_age=2592000`
            return Object.assign({}, song, {
              url,
              albumpic
            })
          })
        )
        cdlist.songlist = datas
        cdlist.songlist.unshift(...songList)
        this.setState({
          playListInfo: cdlist,
          isNoMore: isNoMore,
          pageIndex: cdlist.songlist.length
        })
      })
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

  handleVistnum(vistnum) {
    if (vistnum < 1000) {
      return vistnum
    } else {
      return (vistnum / 10000).toFixed(1) + '万'
    }
  }

  playSong(songInfo) {
    this.props.playSong(Object.assign({}, {
      songid: songInfo.id,
      url: songInfo.url,
      albumpic: songInfo.albumpic,
      name: songInfo.title,
      currentDuration: 0,
      singer: this.handleSinger(songInfo.singer)
    }))
    this.props.setPlayStatus(1)
    
    let songList = []
    for (let [index, song] of Object.entries(this.state.playListInfo.songlist)) {
      songList.push(Object.assign({}, {
        songid: song.id,
        url: song.url,
        albumpic: song.albumpic,
        name: song.title,
        currentDuration: 0,
        singer: this.handleSinger(song.singer)
      }))
    }
    
    this.props.setSongList(songList)
  }

  playAllSong() {
    let songList = []
    for (let [index, song] of Object.entries(this.state.playListInfo.songlist)) {
      songList.push(Object.assign({}, {
        songid: song.id,
        url: song.url,
        albumpic: song.albumpic,
        name: song.title,
        currentDuration: 0,
        singer: this.handleSinger(song.singer)
      }))
    }
    
    this.props.setSongList(songList)

    this.props.playSong(songList[0])
    this.props.setPlayStatus(1)
  }

  render() {
    const isExistData = this.state.playListInfo !== null
    if (isExistData) {
      return (
          <section className="playList-info">
            <section className="playList-info-box" ref="infoBoxRef">
              <section className="playList-info-section">
                <div className="playList-info-cover">
                  <img src={`https://y.gtimg.cn/music/photo_new/T006R300x300M000${this.state.playListInfo.pic_mid}.jpg?max_age=2592000`} alt="专辑图片" />
                </div>
                <div className="playList-info-name-author">
                  <h1 className="playList-info-name">{this.state.playListInfo.dissname}</h1>
                  <div className="playList-info-author">
                    <img className="author-avatar" src={this.state.playListInfo.headurl} alt="歌手图片" />
                    <div className="author-name">
                      <span>{this.state.playListInfo.nickname}</span>
                    </div>
                  </div>
                  <p className="playList-info-time">播放量：{this.handleVistnum(this.state.playListInfo.visitnum)}</p>
                </div>
              </section>
              <img className="playList-info-backImg" src={`https://y.gtimg.cn/music/photo_new/T006R300x300M000${this.state.playListInfo.pic_mid}.jpg?max_age=2592000)`} alt="专辑图片" />
              <div className="opt-box">
                <span className="play-all-btn" onClick={this.playAllSong}>播放全部</span>
              </div>
            </section>
            <section className="playList-song-list-section">
              <p className="playList-song-list-title">专辑<span className="song-num">共{this.state.playListInfo.total_song_num}首</span></p>
              <ul className="playList-song-list">
                {
                  this.state.playListInfo.songlist.map((val, index) => (
                    <li className="playList-song-item" key={val.id} onClick={() => this.playSong(val)}>
                      <div className="playList-song-info">
                        <h3 className="playList-song-name txt-nowrap">{val.title}</h3>
                        <p className="playList-song-singer txt-nowrap">{this.handleSinger(val.singer)} · {val.album.name}</p>
                      </div>
                    </li>
                  ))
                } 
              </ul>
              { !this.state.isNoMore &&
                <p className="load-more" onClick={this.loadMore}>点击加载更多歌曲</p>
              }
            </section>
            {
              this.state.playListInfo.desc !== '' &&
              <section className="playList-desc">
                <h2 className="playList-desc-title">歌单简介</h2>
                <p className="playList-desc-content">{this.state.playListInfo.desc}</p>
              </section>
            }
          </section>
      )
    } else {
      return (<div />)
    }
  }
}
