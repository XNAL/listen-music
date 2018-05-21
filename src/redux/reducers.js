import {
  combineReducers
} from 'redux'
import storage from '../util/storage'
import {
  SET_CURRENT_SONG,
  SET_PLAY_STATUS,
  SET_SHOW_PLAYER,
  SET_SONG_LIST,
  SET_PLAY_MODE
} from './actionTypes'

// 初始化当前播放歌曲
let initState = {
  song: storage.getCurrentSong(),
  showPlayer: storage.getShowPlayer(),
  playStatus: storage.getPlayStatus(),
  songList: storage.getSongList(),
  playMode: storage.getPlayMode()
}

// 设置当前播放歌曲
function song(song = initState.song, action) {
  switch (action.type) {
    case SET_CURRENT_SONG:
      storage.setCurrentSong(action.song)
      return action.song
    default:
      return song
  }
}

// 设置当前播放状态
function playStatus(playStatus = initState.playStatus, action) {
  switch (action.type) {
    case SET_PLAY_STATUS:
      storage.setPlayStatus(action.status)
      return action.status
    default:
      return playStatus
  }
}

// 设置播放器显示情况
function showPlayer(showPlayer = initState.showPlayer, action) {
  switch (action.type) {
    case SET_SHOW_PLAYER:
      storage.setShowPlayer(action.showPlayer)
      return action.showPlayer
    default:
      return showPlayer
  }
}

// 设置歌曲列表
function songList(songList = initState.songList, action) {
  switch (action.type) {
    case SET_SONG_LIST:
      storage.setSongList(action.songList)
      return action.songList
    default:
      return songList
  }
}

// 设置播放模式
function playMode(playMode = initState.playMode, action) {
  switch (action.type) {
    case SET_PLAY_MODE:
      storage.setPlayMode(action.playMode)
      return action.playMode
    default:
      return playMode
  }
}

export default combineReducers({
  song,
  playStatus,
  showPlayer,
  songList,
  playMode
})