import React, { Component } from 'react'
import './MiniPlay.scss'
import musicImg from '../../assets/music_default.png'
import fetch from '../../fetch/index'

export default class MiniPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      playStatus: 0,
      totalDuration: 0
    }
    this.playMusic = this.playMusic.bind(this)
  }

  componentDidMount() {
    this.refs.musicAudio.load()
    // 添加事件监听，当准备好音频时再获取时长
    this.refs.musicAudio.addEventListener("canplay", () =>
      this.setState({
        totalDuration: this.musicAllTime()
      })
    )
    this.refs.musicAudio.addEventListener("ended", () =>
      this.setState({
        playStatus: 0
      })
    )
  }

  playMusic() {
    if (this.state.playStatus === 0) {
      this.refs.musicAudio.play()
      this.setMusicPlayDuration()
      this.setState({
        playStatus: 1
      })
    } else {
      this.refs.musicAudio.pause()
      this.setMusicPlayDuration()
      this.setState({
        playStatus: 0
      })
    }
  }

  setMusicPlayDuration() {
    if (this.state.playStatus === 0) {
        // 设定定时器，根据播放时间调整播放进度
        let timer = setInterval(() => {
            let currentTime = this.musicCurrentTime()
            this.props.changeSongDuration(Object.assign({}, this.props.currentSong, {
              currentDuration: currentTime
            }))
        }, 2000)
        this.setState({
          timer: timer
        })
    } else {
        // 暂停时清除定时器
        clearInterval(this.state.timer)
    }
  }

  // 获取音乐总时间
  musicAllTime() {
    return this.refs.musicAudio.duration || 0
  }

  // 获取音乐当前播放时间
  musicCurrentTime() {
    return (this.refs.musicAudio.currentTime + 2) || 0
  }

  setMusicProgress(duration) {
    if (this.state.totalDuration === 0) {
      return 0
    } else {
      return Math.floor(duration / this.state.totalDuration * 100)
    }
  }

  render() {
    let currentSong = this.props.currentSong
    return (
      <div className="miniplay-component">
        <audio ref="musicAudio" src={currentSong.url} />
        <div className="song-info">
          <div className={'song-img ' + (this.state.playStatus === 1 ? 'imgRotate' : '')}>
            <img src={currentSong.albumpic ? currentSong.albumpic : musicImg} alt="" />
          </div>
          <div className="song-name-lyrics">
            <div className="song-name">{currentSong.name}</div>
            <div className="song-lyrics">{currentSong.lyrics}</div>
          </div>
        </div>
        <div className="operate-group">
          <div className="play-control">
            {
              this.state.playStatus === 1 &&
              <i className="iconfont icon-stop" onClick={this.playMusic} />
            }
            {
              this.state.playStatus === 0 &&
              <i className="iconfont icon-play" onClick={this.playMusic} />
            }
          </div>
          <div className="song-list">
            <i className="iconfont icon-list" />
          </div>
        </div>
        <div className="song-progress" style={{width: `${this.setMusicProgress(currentSong.currentDuration)}%`}}/>
      </div>  
    )
  }
}
