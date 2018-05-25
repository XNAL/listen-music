import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './SingerInfo.scss'
import fetch from '../../fetch/index'
import Loading from '../../components/Loading/Loading'

export default class SingerInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      singerInfo: null,
      pageIndex: 0,
      isNoMore: false,
      showDescModal: false,
      isLoading: false
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.playSong = this.playSong.bind(this)
    this.playAllSong = this.playAllSong.bind(this)
    this.showDescModal = this.showDescModal.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)

    this.setState({
      id: this.props.match.params.id,
      isLoading: true
    }, () => {
      this.fetchSongs()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll);
  }

  loadMore () {
    this.setState({
      isLoading: true
    }, () => {
      this.fetchSongs()
    })
  }

  fetchSongs () {
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
          isLoading: false,
          isNoMore: isNoMore,
          pageIndex: singerInfo.list.length
        })
      })
  }

  handleScroll (event) {
    if (this.refs.infoBoxRef) {
      let scrollTop = document.body.scrollTop | document.documentElement.scrollTop
      if (scrollTop >= 144) {
        this.refs.infoBoxRef.style.position = 'fixed'
        this.refs.infoBoxRef.style.top = '-144px'
      } else {
        this.refs.infoBoxRef.style.position = 'relative'
        this.refs.infoBoxRef.style.top = '0'
      }
    }
  }

  // 处理歌手数据
  handleSinger(singers) {
    let formatSingers = []
    for (let singer of Object.values(singers)) {
      formatSingers.push(singer.name)
    }
    return formatSingers.join(' / ')
  }

  // 格式化粉丝数据
  formatFans(fans) {
    if (fans < 10000) {
      return fans + ' '
    } else {
      return (fans / 10000).toFixed(1) + ' 万'
    }
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

    this.props.playSong(songList[0])
    this.props.setPlayStatus(1)
  }

  showDescModal(isShow) {
    this.setState({
      showDescModal: isShow
    })
  }
  render() {
    const isExistData = this.state.singerInfo !== null
    let arrDesc = (this.state.singerInfo && this.state.singerInfo.SingerDesc) ? (this.state.singerInfo.SingerDesc.split('\n') || []) : []
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
                      <span>粉丝：{this.formatFans(this.state.singerInfo.fans)}人</span>
                    </div>
                  </div>
                  {
                    this.state.singerInfo.SingerDesc !== '' &&
                    <p className="singer-info-desc" onClick={() => this.showDescModal(true)}>{this.state.singerInfo.SingerDesc}</p>
                  }
                </div>
              </section>
              <img className="singer-info-backImg" src={`https://y.gtimg.cn/music/photo_new/T001R150x150M000${this.state.singerInfo.singer_mid}.jpg?max_age=2592000)`} alt="专辑图片" />
              <div className="opt-box">
                <span className="play-all-btn" onClick={this.playAllSong}>播放全部</span>
              </div>
            </section>
            <section className="singer-song-list-section">
              <p className="singer-song-list-title">歌曲<span className="song-num">共{this.state.singerInfo.total}首</span></p>
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
              { !this.state.isNoMore && !this.state.isLoading &&
                <p className="load-more" onClick={this.loadMore}>点击加载更多歌曲</p>
              }
              {
                this.state.isLoading && 
                <div className="loading-song">
                  <Loading />
                </div>
              }
            </section>
            <section className="singer-album-section">
              <h2 className="singer-album-title">最新专辑</h2>
              <ul className="singer-album-list">
                {
                  this.state.singerInfo.albumlist.map((val, index) => (
                    <li className="singer-album-item" key={val.albummid}>
                      <Link to={`/AlbumInfo/${val.albummid}`} className="album-link">
                        <img className="album-img"
                          src={val.pic}
                          alt="专辑图片"
                        />
                        <p className="album-name">{val.name}</p>
                        <p className="album-date">{val.publish_date}</p>
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </section>
            { this.state.showDescModal &&
              <div className="modal-mask">
                <div className="singer-desc-modal">
                    <div className="desc-content">
                    {
                      arrDesc.map((desc, index) => (
                        <p className="desc-para" key={index}>{desc}</p>
                      ))
                    }
                    </div>
                    <div className="btn-close" onClick={() => this.showDescModal(false)}>关闭</div>
                </div>
              </div>
            }
          </section>
      )
    } else {
      return (<div />)
    }
  }
}
