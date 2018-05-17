import React, { Component } from 'react'
import './SongList.scss'
import fetch from '../../fetch/index'

export default class SongList extends Component {
  constructor(props) {
    super(props)
    this.hideSongList = this.hideSongList.bind(this)
    this.playSong = this.playSong.bind(this)
    this.deleteSong = this.deleteSong.bind(this)
    this.changePlayMode = this.changePlayMode.bind(this)
  }

  hideSongList() {
    this.props.parentHideSongList()
  }

  playSong(index) {
    this.props.playSong(this.props.songList[index])
  }

  deleteSong(e, index) {
    e.stopPropagation()
    let songList = this.props.songList
    let deleteSongid = songList[index].songid
    songList.splice(index, 1)
    this.props.setSongList(songList)
    if (deleteSongid === this.props.currentSong.songid) {
      let newIndex = songList.length <= index ? 0 : index
      this.props.playSong(songList[newIndex])
    }
  }

  changePlayMode(playMode) {
    let nextMode = 'ORDER'
    if (playMode === 'ORDER') {
      nextMode = 'RANDOM'
    } else if (playMode === 'RANDOM') {
      nextMode = 'SINGLE'
    }
    this.props.setPlayMode(nextMode)
  }

  render() {
    let songList = this.props.songList || []
    let playMode = this.props.playMode || 'ORDER'
    let iconMode = ''
    let modeText = ''
    switch(playMode.toLowerCase()) {
      case 'random': 
        iconMode = 'random'
        modeText = '随机播放'
        break
      case 'single': 
        iconMode = 'single'
        modeText = '单曲循环'
        break
      default:
        iconMode = 'order'
        modeText = '顺序播放'
    }

    return (
      <div>
        <div className={'mask ' + (this.props.showSongList ? 'show' : '')} 
          onClick={this.hideSongList} ></div>
        <div className={'songlist-component ' + (this.props.showSongList ? 'show' : '')}>
          <div className="songlist-header" onClick={() => this.changePlayMode(playMode)}>
            <i className={'iconfont icon-' + iconMode} />
            <span className="songlist-mode">{modeText}</span>
            <span className="songlist-length">({songList.length}首)</span>
          </div>
          <ul className="songlist-list">
            {songList.map((val, index) => (
                <li className={'songlist-item ' + (this.props.currentSong.songid === val.songid ? 'play' : '')} 
                    key={index} onClick={() => this.playSong(index)} >
                  <span className="songlist-item-song">{val.name}</span>
                  <span className="songlist-item-singer">&nbsp;-&nbsp;{val.singer}</span>
                  <i className="iconfont icon-delete" onClick={(e) => this.deleteSong(e, index)}/>
                </li>
              ))}
          </ul>
          <div className="songlist-footer" onClick={this.hideSongList}>关闭</div>
        </div>  
      </div>
    )
  }
}
