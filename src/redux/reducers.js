import { combineReducers } from 'redux'
import storage from '../util/storage'
import { SET_CURRENT_SONG } from './actionTypes'

// 初始化当前播放歌曲
let initState = {
  song: storage.getCurrentSong()
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

export default combineReducers({
  song
})