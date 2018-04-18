import {
  combineReducers
} from 'redux'
import storage from '../util/storage'
import {
  SET_CURRENT_SONG,
  SET_PLAY_STATUS,
  SET_SONG_LIST
} from './actionTypes'

// 初始化当前播放歌曲
let initState = {
  song: storage.getCurrentSong(),
  playStatus: storage.getPlayDsatus(),
  songList: storage.getSongList()
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
      storage.setPlayDsatus(action.status)
      return action.status
    default:
      return playStatus
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

export default combineReducers({
  song,
  playStatus,
  songList
})