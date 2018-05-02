import React, { Component } from 'react'
import './SingerInfo.scss'
import fetch from '../../fetch/index'

export default class SingerInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      singerInfo: null,
      pageIndex: 0,
      isNoMore: false
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.playSong = this.playSong.bind(this)
    this.playAllSong = this.playAllSong.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)

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
    fetch.getSingerInfo(this.state.id, this.state.pageIndex)
      .then(async res => {
        let singerInfo = res.data
        let songList = []
        if (this.state.singerInfo && this.state.singerInfo.list) {
          songList = this.state.singerInfo.list
        }
        let isNoMore = false

        if (songList.length + singerInfo.list.length === singerInfo.total) {
          isNoMore = true
        }
        let datas = await Promise.all(
          singerInfo.list.map(async (song) => {
            let vkeyData = await fetch.getSongVkey(song.musicData.songmid)
            let url = `http://dl.stream.qqmusic.qq.com/C400${song.musicData.songmid}.m4a?vkey=${vkeyData.data.items[0].vkey}&guid=3030549298&uin=772528797&fromtag=66`
            let albumpic = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.musicData.albummid}.jpg?max_age=2592000`
            return Object.assign({}, song, {
              url,
              albumpic
            })
          })
        )
        singerInfo.list = datas
        singerInfo.list.unshift(...songList)
        this.setState({
          singerInfo: singerInfo,
          isNoMore: isNoMore,
          pageIndex: singerInfo.list.length
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

  playSong(songInfo) {
    this.props.playSong(Object.assign({}, {
      songid: songInfo.musicData.songid,
      songmid: songInfo.musicData.songmid,
      url: songInfo.url,
      albumpic: songInfo.albumpic,
      name: songInfo.musicData.songname,
      currentDuration: 0,
      singer: this.handleSinger(songInfo.musicData.singer)
    }))
    this.props.setPlayStatus(1)

    let songList = []
    for (let [index, song] of Object.entries(this.state.singerInfo.list)) {
      songList.push(Object.assign({}, {
        songid: song.musicData.songid,
        songmid: song.musicData.songmid,
        url: song.url,
        albumpic: song.albumpic,
        name: song.musicData.songname,
        currentDuration: 0,
        singer: this.handleSinger(song.musicData.singer)
      }))
    }
    
    this.props.setSongList(songList)
  }

  playAllSong() {
    let songList = []
    for (let [index, song] of Object.entries(this.state.singerInfo.songlist)) {
      songList.push(Object.assign({}, {
        songid: song.musicData.songid,
        songmid: song.musicData.songmid,
        url: song.url,
        albumpic: song.albumpic,
        name: song.musicData.songname,
        currentDuration: 0,
        singer: this.handleSinger(song.musicData.singer)
      }))
    }
    
    this.props.setSongList(songList)

    this.props.playSong(songList[0])
    this.props.setPlayStatus(1)

  }

  render() {
    const isExistData = this.state.singerInfo !== null
    if (isExistData) {
      return (
          <section className="singer-info">
            <section className="singer-info-box" ref="infoBoxRef">
              <section className="singer-info-section">
                <div className="singer-info-cover">
                  <img src={`https://y.gtimg.cn/music/photo_new/T001R150x150M000${this.state.singerInfo.singer_mid}.jpg?max_age=2592000`} alt="专辑图片" />
                </div>
                <div className="singer-info-name-author">
                  <h1 className="singer-info-name">{this.state.singerInfo.singer_name}</h1>
                  <div className="singer-info-author">
                    <div className="author-name">
                      <span>粉丝：{this.state.singerInfo.fans} 万人</span>
                    </div>
                  </div>
                  {
                    this.state.singerInfo.SingerDesc !== '' &&
                    <p className="singer-info-desc">{this.state.singerInfo.SingerDesc}</p>
                  }
                </div>
              </section>
              <img className="singer-info-backImg" src={`https://y.gtimg.cn/music/photo_new/T001R150x150M000${this.state.singerInfo.singer_mid}.jpg?max_age=2592000)`} alt="专辑图片" />
              <div className="opt-box">
                <span className="play-all-btn" onClick={this.playAllSong}>播放全部</span>
              </div>
            </section>
            <section className="singer-song-list-section">
              <p className="singer-song-list-title">排行榜<span className="song-num">共{this.state.singerInfo.total}首</span></p>
              <ul className="singer-song-list">
                {
                  this.state.singerInfo.list.map((val, index) => (
                    <li className="singer-song-item" key={val.musicData.songid} onClick={() => this.playSong(val)}>
                      <div className="singer-song-info">
                        <h3 className="singer-song-name txt-nowrap">{val.musicData.songname}</h3>
                        <p className="singer-song-singer txt-nowrap">{this.handleSinger(val.musicData.singer)}</p>
                      </div>
                    </li>
                  ))
                }
              </ul>
              { !this.state.isNoMore &&
                <p className="load-more" onClick={this.loadMore}>点击加载更多歌曲</p>
              }
            </section>
          </section>
      )
    } else {
      return (<div />)
    }
  }
}
