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
      lyricsList: [],
      showLyrics: false,
      currentSongmid: '',
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }
    this.playMusic = this.playMusic.bind(this)
    this.showSongList = this.showSongList.bind(this)
    this.hideSongList = this.hideSongList.bind(this)
    this.hidePlayer = this.hidePlayer.bind(this)
    this.handleShowPlayer = this.handleShowPlayer.bind(this)
    this.changePlayMode = this.changePlayMode.bind(this)
    this.fomatSongTime = this.fomatSongTime.bind(this)
    this.songLyricIndex = this.songLyricIndex.bind(this)
    this.changePlayProgress = this.changePlayProgress.bind(this)
    this.changeShowArea = this.changeShowArea.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.clearPlaySong = this.clearPlaySong.bind(this)
  }

  componentDidMount() {
    this.refs.musicAudio.load()
    this.refs.musicAudio.volume = 0.6

    // 添加事件监听，当准备好音频时再获取时长
    this.refs.musicAudio.addEventListener("canplay", () => {
      let isNewSong = false
      if (this.state.currentSongmid !== this.props.currentSong.songmid) {
        isNewSong = true
        this.setState({
          currentSongmid: this.props.currentSong.songmid
        })
      }
      // 获取并处理歌词
      if (isNewSong || this.state.lyricsList.length === 0) {
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
      }
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
        this.setMusicPlayDuration(1)
        this.setState({
          totalDuration: this.musicAllTime()
        })
      } else {
        this.setState({
          totalDuration: this.musicAllTime()
        })
      }
    })
    // 播放完成事件
    this.refs.musicAudio.addEventListener("ended", () => {
      // 只有一首歌曲或者单曲循环时
      if (this.props.songList.length === 1 || this.props.playMode === 'SINGLE') {
        this.setState({
          lyricIndex: -1
        })
        this.refs.musicAudio.play()
      } else {
        this.setState({
          lyricsList: [],
          lyricIndex: -1
        })
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
    // 音频加载失败事件(歌曲vkey过期重新获取vkey)
    this.refs.musicAudio.addEventListener("error", () => {
      if (this.props.currentSong.songmid) {
        let currentSong = this.props.currentSong
        fetch.getSongVkey(currentSong.songmid)
          .then(res => {
            let url = `http://dl.stream.qqmusic.qq.com/C400${currentSong.songmid}.m4a?vkey=${res.data.items[0].vkey}&guid=3030549298&uin=772528797&fromtag=66`
            let playSong = Object.assign({}, {
              songmid: currentSong.songmid,
              songid: currentSong.songid,
              name: currentSong.name,
              singer: currentSong.singer,
              albumpic: currentSong.albumpic,
              url
            })
            this.props.playNextSong(playSong)
            let songList = this.props.songList
            let playIndex = -1
            for(let [index, song] of songList.entries()) {
              if (song.songid === currentSong.songid) {
                playIndex = index
                break
              }
            }
            if (playIndex !== -1) {
              songList.splice(playIndex, 1, playSong)
              this.props.setSongList(songList)
            }
          })
      }
    })
  }
  componentWillUpdate () {
    if (!(this.props.currentSong.url && this.props.currentSong.songmid)) {
      this.clearPlaySong()
    }
  }

  componentDidUpdate () {
    if (this.refs.lyricsWrapRef) {
      this.refs.lyricsWrapRef.addEventListener('touchstart', this.handleTouchStart)
      this.refs.lyricsWrapRef.addEventListener('touchmove', this.handleTouchMove)
    }

  }

  // 播放/暂停音乐
  playMusic() {
    if (this.props.playStatus == 0) {
      this.refs.musicAudio.play()
      this.props.changePlayStatus(1)
      this.setMusicPlayDuration(1)
    } else {
      this.refs.musicAudio.pause()
      this.props.changePlayStatus(0)
      this.setMusicPlayDuration(0)
    }
  }

  // 上一首/下一首
  playNextMusic(next) {
    if (this.props.songList.length === 1) {
      this.refs.musicAudio.currentTime = 0
      this.props.changeSongDuration(Object.assign({}, this.props.currentSong, {
        currentDuration: 0
      }))
    } else {
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
      this.setState({
        lyricsList: []
      })
    }
  }

  // 设置定时器处理音乐播放时间
  setMusicPlayDuration(playStatus) {
    if (this.timer && playStatus == 0) {
      // 清除定时器
      clearInterval(this.timer)
    } else {
      // 设定定时器，根据播放时间调整播放进度
      this.timer = setInterval(() => {
        let currentTime = this.musicCurrentTime()

        if (this.props.currentSong.url && this.props.currentSong.songid) {
          this.props.changeSongDuration(Object.assign({}, this.props.currentSong, {
            currentDuration: currentTime
          }))
        }
      }, 500)
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
      return (duration / this.state.totalDuration * 100).toFixed(2)
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
    if (this.state.showLyrics) {
      this.setState({
        showLyrics: false
      })
    } else {
      this.props.setShowPlayer(false)
    }
  }

  // 显示播放器
  handleShowPlayer() {
    this.props.setShowPlayer(true)
  }

  // 处理touchstart事件
  handleTouchStart (e) {
    e.preventDefault()
    this.setState({
      startX: e.changedTouches[0].pageX,
      startY: e.changedTouches[0].pageY
    })
  }

  // 处理touchmove事件
  handleTouchMove (e) {
    e.preventDefault()
    let endX = e.changedTouches[0].pageX
    let endY = e.changedTouches[0].pageY
    // 向下移动超过50px，则隐藏播放器
    if (endY - this.state.startY > 50) {
      this.props.setShowPlayer(false)
    } else {
      // 隐藏歌词
      if (endX - this.state.startX > 50 && this.state.showLyrics) {
        this.setState({
          showLyrics: false
        })
      }
      // 显示歌词
      if (endX - this.state.startX < -50 && !this.state.showLyrics) {
        this.setState({
          showLyrics: true
        })
      }
    }
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
    if (time) {
      let minutes = Math.floor(time / 60)
      let seconds = Math.floor(time % 60)
      return `${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`
    } else {
      return '00:00'
    }
  }

  // 获取歌词数组显示index
  songLyricIndex(currentDuration) {
    let listIndex = 0
    let lyricsList = this.state.lyricsList
    for(let i = 0; i < lyricsList.length; i++) {
      let nextLyricTime = 0
      let nextIndex = i < lyricsList.length - 1 ? (i + 1) : i
      nextLyricTime = lyricsList[nextIndex][0]
      listIndex = lyricsList[i][1] === '' ? listIndex : listIndex + 1
      if (i === lyricsList.length - 1 && currentDuration >= lyricsList[i][0]) {
        return {
          lyricIndex: i,
          listIndex: listIndex
        }
      }
      else if (currentDuration >= lyricsList[i][0] && currentDuration <= nextLyricTime) {
        let index = lyricsList[i][1] === '' ? (i - 1) : i
        return { lyricIndex: index, listIndex: listIndex }
      }
    }
  }

  // 改变歌曲播放进度
  changePlayProgress(e) {
    let progressWidth = this.refs.progressRef.clientWidth
    let progressLeft = this.refs.progressRef.offsetLeft
    let clickPostion = e.nativeEvent.pageX

    if (clickPostion < progressLeft && clickPostion > (progressLeft + progressWidth)) {
      return
    } else {
      let newTime = Math.floor(this.state.totalDuration * (clickPostion - progressLeft) / progressWidth)
      newTime = newTime >= this.state.totalDuration ? (this.state.totalDuration - 0.1) : newTime
      this.refs.musicAudio.currentTime = newTime
      this.props.changeSongDuration(Object.assign({}, this.props.currentSong, {
        currentDuration: newTime
      }))
    }
  }

  // 切换显示区域
  changeShowArea(isShow) {
    this.setState({
      showLyrics: isShow
    })
  }

  // 清除当前播放的歌曲
  clearPlaySong() {
    if (!(this.props.playStatus == 0 && this.state.lyricsList.length === 0)) {
      this.refs.musicAudio.src = ""
      clearInterval(this.timer)
      this.props.changePlayStatus(0)
      this.setMusicPlayDuration(0)
      this.setState({
        lyricsList: []
      })
    }
  }
  
  render() {
    let currentSong = this.props.currentSong || {}
    let playStatus = this.props.playStatus || 0
    let showPlayer = this.props.showPlayer == true
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
    let songLyric = this.songLyricIndex(this.props.currentSong.currentDuration)
    songLyric = songLyric ? songLyric : { lyricIndex: 0, listIndex: 0 }
    let { lyricIndex, listIndex } = songLyric
    return (
      <div className="player">
        <audio ref="musicAudio" src={currentSong.url} />
        { showPlayer && 
          <div className="play-component">
            <img className="album-info-backImg" src={currentSong.albumpic ? currentSong.albumpic : musicImg} alt="专辑图片" />
            <div className="play-area">
              <div className="song-name">
                <i className={"iconfont icon-collapse " + (this.state.showLyrics ? 'icon-lyrics' : '')} onClick={this.hidePlayer} />
                {currentSong.name}
              </div>
            </div>
            <div className="play-area show-lyrics-area-wrap" ref="lyricsWrapRef">
              {
                this.state.showLyrics && 
                <div className="show-lyrics-area">
                    <div className="lyrics-list-area">
                      {
                        this.state.lyricsList.length > 0 &&
                        <ul className={"song-lyrics-list " + (listIndex > 0 ? 'transition' : '') + (lyricIndex < 0 ? ' no-transition' : '')} style={{transform: `translateY(${ 300 - 42 * listIndex}px)` }}>
                          {
                            this.state.lyricsList.map((val, index) => (
                              <li className={"song-lyrics-item " + (lyricIndex === index ? 'current' : '')} key={index}>{val[1]}</li>
                            ))
                          } 
                        </ul>
                      }
                      {
                        this.state.lyricsList.length === 0 &&
                        <div className="lyrics-list-empty">正在搜索歌词...</div>
                      }
                    </div>
                </div>
              }
              {
                !this.state.showLyrics && 
                <div className="show-lyrics-area">
                  <div className="play-song song-singer">
                    <p className="singers">{currentSong.singer}</p>
                  </div>
                  <div className={'play-song song-img ' + (playStatus == 1 ? 'running' : 'paused')}>
                    <img src={currentSong.albumpic ? currentSong.albumpic : musicImg} alt="" />
                  </div>
                  <div className="play-song song-lyrics">
                    {
                      this.state.lyricsList.length > 0 &&
                      <ul className={"song-lyrics-list " + (lyricIndex > 0 ? 'transition' : '')} style={{transform: `translateY(${ -18 * lyricIndex}px)` }}>
                        {
                          this.state.lyricsList.map((val, index) => (
                            <li className={"song-lyrics-item " + (lyricIndex === index ? 'current' : '')} key={index}>{val[1]}</li>
                          ))
                        } 
                      </ul>
                    }
                    {
                      this.state.lyricsList.length === 0 &&
                      <div className="lyrics-list-empty">正在搜索歌词...</div>
                    }
                  </div>
                </div>
              }
            </div>
            <div className="play-area area-dot-list">
              <i className={"area-dot-item " + (!this.state.showLyrics ? 'current' : '')} onClick={() => this.changeShowArea(false)} />
              <i className={"area-dot-item " + (this.state.showLyrics ? 'current' : '')} onClick={() => this.changeShowArea(true)} />
            </div>
            <div className="play-area">
              <div className="play-song song-progress">
                <p className="song-time current-time">{this.fomatSongTime(currentSong.currentDuration)}</p>
                <div className="progress-bk" ref="progressRef" onClick={(e) => this.changePlayProgress(e)}>
                  <p className="progress-percent" style={{width: `${this.setMusicProgress(currentSong.currentDuration)}%`}}></p>
                </div>
                <p className="song-time total-time">{this.fomatSongTime(this.state.totalDuration)}</p>
              </div>
            </div>
            <div className="play-area operate-group">
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
        { !showPlayer && 
          <MiniPlay currentSong={currentSong} 
            totalDuration = {this.state.totalDuration}
            playStatus={playStatus}
            lyricsList={this.state.lyricsList}
            lyricIndex={lyricIndex}
            parentShowPlayer={this.handleShowPlayer}
            parentPlayMusic={this.playMusic}
          /> 
        }
      </div>
    )
  }
}
