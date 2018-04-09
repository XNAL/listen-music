import React, { Component } from 'react'
import './MiniPlay.scss'

export default class MiniPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      song: {
        playStatus: 1
      }
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="miniplay-component">
        <div className="song-info">
          <div className="song-img">
            <img src="http://y.gtimg.cn/music/photo_new/T002R150x150M000000jE4g74VS43p.jpg?max_age=2592000" alt="" />
          </div>
          <div className="song-name-lyrics">
            <div className="song-name">朵</div>
            <div className="song-lyrics">我爱这世间美貌的女子</div>
          </div>
        </div>
        <div className="operate-group">
          <div className="play-control">
            {
              this.state.song && this.state.song.playStatus && this.state.song.playStatus === 1 &&
              <i className="iconfont icon-stop" />
            }
            {
              this.state.song && this.state.song.playStatus && this.state.song.playStatus === 0 &&
              <i className="iconfont icon-play" />
            }
          </div>
          <div className="song-list">
            <i className="iconfont icon-list" />
          </div>
        </div>
        <div className="song-progress" />
      </div>  
    )
  }
}
