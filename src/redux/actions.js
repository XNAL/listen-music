import { 
  SET_CURRENT_SONG,
  SET_PLAY_STATUS,
  SET_SONG_LIST,
  SET_PLAY_MODE } from './actionTypes'

// 设置当前播放歌曲
export function setCurrentSong (song) {
  return { type: SET_CURRENT_SONG, song }
}

// 设置当前歌曲播放状态
export function setPlayStatus (status) {
  return { type: SET_PLAY_STATUS, status }
}

// 设置歌曲列表
export function setSongList (songList) {
  return { type: SET_SONG_LIST, songList }
}

// 设置播放模式
export function setPlayMode (playMode) {
  return { type: SET_PLAY_MODE, playMode }
}