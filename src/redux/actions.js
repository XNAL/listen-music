import { SET_CURRENT_SONG, SET_PLAY_STATUS } from './actionTypes'

// 设置当前播放歌曲
export function setCurrentSong (song) {
  return { type: SET_CURRENT_SONG, song }
}

// 设置当前歌曲播放状态
export function setPlayStatus (status) {
  return { type: SET_PLAY_STATUS, status }
}