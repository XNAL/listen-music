import React, { Component } from 'react'
import './MiniPlay.scss'
import musicImg from '../../assets/music_default.png'

// let timer = null
export default class MiniPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      song: {
        name: '朵',
        lyrics: '赵雷',
        albumpic: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000000jE4g74VS43p.jpg?max_age=2592000',
        progress: 0,
        playStatus: 0,
        duration: 0
      },
      timer: null
    }
    this.playMusic = this.playMusic.bind(this)
  }

  componentDidMount() {
    // this.refs.musicAudio.src = 'http://dl.stream.qqmusic.qq.com/C400004IArbh3ytHgR.m4a?vkey=F63222D66A17AC59199F8B30222F8724DAE044138223762AD34C1DF94D60AA355D3C2380381B57790EA28E1F3F3BBC31A1493C4E33B699E7&guid=3030549298&uin=772528797&fromtag=66'
    this.refs.musicAudio.src = 'http://dl.stream.qqmusic.qq.com/C400004IArbh3ytHgR.m4a?vkey=F63222D66A17AC59199F8B30222F8724DAE044138223762AD34C1DF94D60AA355D3C2380381B57790EA28E1F3F3BBC31A1493C4E33B699E7&guid=3030549298&uin=772528797&fromtag=66'
    this.refs.musicAudio.load()
    // 添加事件监听，当准备好音频时再获取时长
    this.refs.musicAudio.addEventListener("canplay", () =>
      this.setState({
        song: Object.assign({}, this.state.song, {
          duration: this.musicAllTime()
        })
      })
    )
  }

  playMusic() {
    if (this.state.song.playStatus === 0) {
      this.refs.musicAudio.play()
      this.setMusicProgress()
      this.setState({
        song: Object.assign({}, this.state.song, {
          playStatus: 1
        })
      })
    } else {
      this.refs.musicAudio.pause()
      this.setMusicProgress()
      this.setState({
        song: Object.assign({}, this.state.song, {
          playStatus: 0
        })
      })
    }
  }

  setMusicProgress() {
    if (this.state.song.playStatus === 0) {
        // 设定定时器，根据播放时间调整播放进度
        let timer = setInterval(() => {
            let allTime = this.state.song.duration
            let currentTime = this.musicCurrentTime()
            this.setState({
              song: Object.assign({}, this.state.song, {
                progress: Math.floor(currentTime / allTime * 100)
              })
            })
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

  render() {
    return (
      <div className="miniplay-component">
        <audio ref="musicAudio" src="" />
        <div className="song-info">
          <div className={'song-img ' + (this.state.song.playStatus === 1 ? 'imgRotate' : '')}>
            <img src={this.state.song.albumpic ? this.state.song.albumpic : musicImg} alt="" />
          </div>
          <div className="song-name-lyrics">
            <div className="song-name">{this.state.song.name}</div>
            <div className="song-lyrics">{this.state.song.lyrics}</div>
          </div>
        </div>
        <div className="operate-group">
          <div className="play-control">
            {
              this.state.song && this.state.song.playStatus === 1 &&
              <i className="iconfont icon-stop" onClick={this.playMusic} />
            }
            {
              this.state.song && this.state.song.playStatus === 0 &&
              <i className="iconfont icon-play" onClick={this.playMusic} />
            }
          </div>
          <div className="song-list">
            <i className="iconfont icon-list" />
          </div>
        </div>
        <div className="song-progress" style={{width: `${this.state.song.progress}%`}}/>
      </div>  
    )
  }
}
