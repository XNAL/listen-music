import { SET_CURRENT_SONG } from './actionTypes'

// 设置当前播放歌曲
export function setCurrentSong (song) {
  return { type: SET_CURRENT_SONG, song }
}