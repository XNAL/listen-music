import React, { Component } from 'react'
import './Player.scss'
import musicImg from '../../assets/music_default.png'
import MiniPlay from './MiniPlay'
import SongList from '../../container/SongList'
import fetch from '../../fetch/index'

export default class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
      totalDuration: 0,
      showSongList: false,
      isInit: true,
      showPlayer: false,
      lyricsList: []
    }
    this.playMusic = this.playMusic.bind(this)
    this.showSongList = this.showSongList.bind(this)
    this.hideSongList = this.hideSongList.bind(this)
    this.hidePlayer = this.hidePlayer.bind(this)
    this.showPlayer = this.showPlayer.bind(this)
    this.changePlayMode = this.changePlayMode.bind(this)
    this.fomatSongTime = this.fomatSongTime.bind(this)
    this.songLyricIndex = this.songLyricIndex.bind(this)
  }

  componentDidMount() {
    this.refs.musicAudio.load()
    this.refs.musicAudio.volume = 0.6

    // 添加事件监听，当准备好音频时再获取时长
    this.refs.musicAudio.addEventListener("canplay", () => {
      // 获取并处理歌词
      fetch.getSongLyric(this.props.currentSong.songmid)
        .then(res => {
          let lyricData = res.data.data
          let pattern = /\[\d{2}:\d{2}.\d{2}\]/g
          let arrLyric = lyricData.split('\n')
          let lyricsList = [];
          while (!pattern.test(arrLyric[0])) {
            arrLyric = arrLyric.slice(1);
          }
          for (let data of arrLyric) {
            let index = data.indexOf(']')
            let time = data.substring(0, index + 1)
            let value = data.substring(index + 1)
            let timeString = time.substring(1, time.length - 2)
            let timeArr = timeString.split(':')
            lyricsList.push([parseInt(timeArr[0], 10) * 60 + parseFloat(timeArr[1]), value])
          }
          this.setState({
            lyricsList: lyricsList
          })
        })
      // 歌曲初始化完成后获取当前歌曲的播放时间
      let currentDuration = this.props.currentSong.currentDuration || 0
      if (this.state.isInit) {
        this.refs.musicAudio.currentTime = currentDuration
        this.setState({
          isInit: false
        })
      }
      if (this.props.playStatus == 1) {
        this.refs.musicAudio.play()
        this.setMusicPlayDuration()
        this.setState({
          totalDuration: this.musicAllTime()
        })
      } else {
        this.setState({
          totalDuration: this.musicAllTime()
        })
      }
    })
    this.refs.musicAudio.addEventListener("ended", () => {
      // 只有一首歌曲或者单曲循环时
      if (this.props.songList.length === 1 || this.props.playMode === 'SINGLE') {
        this.refs.musicAudio.play()
      } else {
        let playIndex = 0
        // 随机播放
        if (this.props.playMode === 'RANDOM') {
          playIndex = Math.floor(Math.random() * this.props.songList.length)
        } else {
          // 循环播放
          for(let [index, song] of this.props.songList.entries()) {
            if (song.songid === this.props.currentSong.songid) {
              playIndex = index
              break
            }
          }
          if (playIndex >= this.props.songList.length - 1) {
            playIndex = 0
          } else {
            playIndex ++
          }
        }
        this.props.playNextSong(this.props.songList[playIndex])
      }
    })
  }

  // 播放/暂停音乐
  playMusic() {
    if (this.props.playStatus == 0) {
      this.refs.musicAudio.play()
      this.setMusicPlayDuration()
      this.props.changePlayStatus(1)
    } else {
      this.refs.musicAudio.pause()
      this.setMusicPlayDuration()
      this.props.changePlayStatus(0)
    }
  }

  // 上一首/下一首
  playNextMusic(next) {
    let playIndex = 0
    // 随机播放
    if (this.props.playMode === 'RANDOM') {
      playIndex = Math.floor(Math.random() * this.props.songList.length)
    } else {
      for(let [index, song] of this.props.songList.entries()) {
        if (song.songid === this.props.currentSong.songid) {
          playIndex = index
          break
        }
      }
      playIndex += next
      if (playIndex >= this.props.songList.length - 1) {
        playIndex = 0
      } else if (playIndex < 0){
        playIndex = this.props.songList.length - 1
      }
    }
    this.props.playNextSong(this.props.songList[playIndex])
  }

  // 设置定时器处理音乐播放时间
  setMusicPlayDuration() {
    if (this.state.timer && this.props.playStatus == 0) {
      // 清除定时器
      clearInterval(this.state.timer)
      this.setState({
        timer: null
      })
    } else {
      // 设定定时器，根据播放时间调整播放进度
      let timer = setInterval(() => {
        let currentTime = this.musicCurrentTime()
        this.props.changeSongDuration(Object.assign({}, this.props.currentSong, {
          currentDuration: currentTime
        }))
      }, 500)
      this.setState({
        timer: timer
      })
    }
  }

  // 获取音乐总时间
  musicAllTime() {
    return this.refs.musicAudio.duration || 0
  }

  // 获取音乐当前播放时间
  musicCurrentTime() {
    return this.refs.musicAudio.currentTime || 0
  }

  // 设置播放进度
  setMusicProgress(duration) {
    if (this.state.totalDuration === 0) {
      return 0
    } else {
      return Math.floor(duration / this.state.totalDuration * 100)
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
    this.setState({
      showPlayer: true
    })
  }

  // 改变歌曲播放模式
  changePlayMode(playMode) {
    let nextMode = 'ORDER'
    if (playMode === 'ORDER') {
      nextMode = 'RANDOM'
    } else if (playMode === 'RANDOM') {
      nextMode = 'SINGLE'
    }
    this.props.setPlayMode(nextMode)
  }

  // 格式化歌曲时间
  fomatSongTime(time) {
    let minutes = Math.floor(time / 60)
    let seconds = Math.floor(time % 60)
    return `${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`
  }

  // 获取歌词数组显示index
  songLyricIndex(currentDuration) {
    if (this.props.playStatus == 1) {
      let lyricsList = this.state.lyricsList
      for(let i = 0; i < lyricsList.length; i++) {
        let nextLyricTime = 0
        let nextIndex = i < lyricsList.length - 1 ? (i + 1) : i
        nextLyricTime = lyricsList[nextIndex][0]
        if (currentDuration >= lyricsList[i][0] && currentDuration <= nextLyricTime) {
          return lyricsList[i][1] === '' ? (i - 1) : i
        }
      }
    }
  }
  
  render() {
    let currentSong = this.props.currentSong
    let playStatus = this.props.playStatus
    let playMode = this.props.playMode || 'ORDER'
    let iconMode = ''
    switch(playMode.toLowerCase()) {
      case 'random': 
        iconMode = 'random'
        break
      case 'single': 
        iconMode = 'single'
        break
      default:
        iconMode = 'order'
    }
    let lyricIndex = this.songLyricIndex(this.props.currentSong.currentDuration)
    return (
      <div className="player">
        <audio ref="musicAudio" src={currentSong.url} />
        { this.state.showPlayer && 
          <div className="play-component">
            <img className="album-info-backImg" src={currentSong.albumpic ? currentSong.albumpic : musicImg} alt="专辑图片" />
            <i className="iconfont icon-collapse" onClick={this.hidePlayer} />
            <div className="play-song song-name">{currentSong.name}</div>
            <div className="play-song song-singer">
              <p className="singers">{currentSong.singer}</p>
            </div>
            <div className={'play-song song-img ' + (playStatus == 1 ? 'running' : 'paused')}>
              <img src={currentSong.albumpic ? currentSong.albumpic : musicImg} alt="" />
            </div>
            <div className="play-song song-lyrics">
              <ul className="song-lyrics-list" style={{transform: `translateY(${ -18 * lyricIndex}px)` }}>
                {
                  this.state.lyricsList.map((val, index) => (
                    <li className={"song-lyrics-item " + (lyricIndex === index ? 'current' : '')} key={index}>{val[1]}</li>
                  ))
                } 
              </ul>
            </div>
            <div className="play-song song-progress">
              <p className="song-time current-time">{this.fomatSongTime(currentSong.currentDuration)}</p>
              <div className="progress-bk">
                <p className="progress-percent" style={{width: `${this.setMusicProgress(currentSong.currentDuration)}%`}}></p>
              </div>
              <p className="song-time total-time">{this.fomatSongTime(this.state.totalDuration)}</p>
            </div>
            <div className="play-song operate-group">
              <i className={'iconfont icon-' + iconMode} onClick={() => this.changePlayMode(playMode)} />
              <i className="iconfont icon-prev" onClick={() => this.playNextMusic(-1)} />
              {
                playStatus == 1 &&
                <i className="iconfont icon-stop" onClick={this.playMusic} />
              }
              {
                playStatus == 0 &&
                <i className="iconfont icon-play" onClick={this.playMusic} />
              }
              <i className="iconfont icon-next" onClick={() => this.playNextMusic(1)} />
              <i className="iconfont icon-list" onClick={this.showSongList}/>
            </div>
          </div>
        }
        <SongList showSongList={this.state.showSongList}
          parentHideSongList={this.hideSongList}
        />
        { !this.state.showPlayer && 
          <MiniPlay currentSong={currentSong} 
            totalDuration = {this.state.totalDuration}
            playStatus={playStatus}
            parentShowPlayer={this.showPlayer}
            parentPlayMusic={this.playMusic}
          /> 
        }
      </div>
    )
  }
}
