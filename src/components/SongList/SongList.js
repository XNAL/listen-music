import React, { Component } from 'react'
import './SongList.scss'
import fetch from '../../fetch/index'

export default class SongList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playList: []
    }
  }

  componentDidMount() {
    fetch.getPlayList()
      .then(res => {
        this.setState({
          playList: res.recomPlaylist.data.v_hot.slice(0, 6)
        })
      })
  }

  render() {
    let songList = this.props.songList || []
    let playMode = this.props.playMode || 0
    let iconMode = ''
    let modeText = ''
    switch(playMode) {
      case 1: 
        iconMode = 'random'
        modeText = '随机播放'
        break
      case 2: 
        iconMode = 'single'
        modeText = '单曲循环'
        break
      default:
        iconMode = 'order'
        modeText = '顺序播放'
    }
    return (
      <div className="songlist-component">
        <div className="songlist-header">
          <i className={'iconfont icon-' + iconMode} />
          <span className="songlist-mode">{modeText}</span>
          <span className="songlist-length">({songList.length}首)</span>
        </div>
        <ul className="songlist-list">
          {songList.map(val => (
              <li className="songlist-item" key={val.index} >
                <span className="songlist-item-song">{val.name}</span>
                <span className="songlist-item-singer">&nbsp;-&nbsp;{val.singer}</span>
                <i className="iconfont icon-delete" />
              </li>
            ))}
        </ul>
        <div className="songlist-footer">关闭</div>
      </div>  
    )
  }
}
