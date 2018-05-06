import React, { Component } from 'react'
import './MiniPlay.scss'
import musicImg from '../../assets/music_default.png'
import SongList from '../../container/SongList'

export default class MiniPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      showSongList: false
    }
    this.playMusic = this.playMusic.bind(this)
    this.showSongList = this.showSongList.bind(this)
    this.hideSongList = this.hideSongList.bind(this)
    this.hidePlayer = this.hidePlayer.bind(this)
    this.showPlayer = this.showPlayer.bind(this)
  }

  componentDidMount() {
    
  }

  // 播放/暂停音乐
  playMusic() {
    this.props.parentPlayMusic()
  }

  // 设置播放进度
  setMusicProgress(duration) {
    if (this.props.totalDuration === 0) {
      return 0
    } else {
      return Math.floor(duration / this.props.totalDuration * 100)
    }
  }

  // 显示歌曲列表
  showSongList() {
    this.setState({
      showSongList: true
    })
  }

  // 隐藏歌曲列表
  hideSongList() {
    this.setState({
      showSongList: false
    })
  }

  // 隐藏播放器
  hidePlayer() {
    this.setState({
      showPlayer: false
    })
  }

  // 显示播放器
  showPlayer() {
    this.props.parentShowPlayer()
  }

  render() {
    let currentSong = this.props.currentSong
    let playStatus = this.props.playStatus
    return (
      <div>
        <SongList showSongList={this.state.showSongList}
          parentHideSongList={this.hideSongList}
        />
        <div className="miniplay-component">
          <div className="song-info" onClick={this.showPlayer}>
            <div className={'song-img ' + (playStatus == 1 ? 'running' : 'paused')}>
              <img src={currentSong.albumpic ? currentSong.albumpic : musicImg} alt="" />
            </div>
            <div className="song-name-lyrics">
              <div className="song-name">{currentSong.name}</div>
              {/* <div className="song-lyrics">{currentSong.singer}</div> */}

              <div className="play-song song-lyrics">
                <ul className="song-lyrics-list" style={{transform: `translateY(${ -18 * this.props.lyricIndex}px)` }}>
                  {
                    this.props.lyricsList.map((val, index) => (
                      <li className={"song-lyrics-item " + (this.props.lyricIndex === index ? 'current' : '')} key={index}>{val[1]}</li>
                    ))
                  } 
                </ul>
              </div>
            </div>
          </div>
          <div className="operate-group">
            <div className="play-control">
              {
                playStatus == 1 &&
                <i className="iconfont icon-stop" onClick={this.playMusic} />
              }
              {
                playStatus == 0 &&
                <i className="iconfont icon-play" onClick={this.playMusic} />
              }
            </div>
            <div className="song-list">
              <i className="iconfont icon-list" onClick={this.showSongList}/>
            </div>
          </div>
          <div className="song-progress" style={{width: `${this.setMusicProgress(currentSong.currentDuration)}%`}} />
        </div>
      </div>
    )
  }
}
