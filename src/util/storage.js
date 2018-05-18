export default {
  setCurrentSong (song) {
    window.localStorage.setItem('LM_SONG', JSON.stringify(song))
  },
  getCurrentSong () {
    let song = window.localStorage.getItem('LM_SONG')
    return song ? JSON.parse(song) : {}
  },
  setPlayDsatus (status) {
    window.sessionStorage.setItem('LM_PLAY_STATUS', status)
  },
  getPlayDsatus () {
    let status = window.sessionStorage.getItem('LM_PLAY_STATUS')
    return status || 0
  },
  setSongList (songList) {
    window.localStorage.setItem('LM_SONG_LIST', JSON.stringify(songList))
  },
  getSongList () {
    let songList = window.localStorage.getItem('LM_SONG_LIST')
    return songList ? JSON.parse(songList) : []
  },
  setPlayMode (mode) {
    window.localStorage.setItem('LM_PLAY_Mode', mode)
  },
  getPlayMode () {
    let mode = window.localStorage.getItem('LM_PLAY_Mode')
    return mode || 'ORDER'
  },
  setSearchHistory (sarchHistory) {
    window.localStorage.setItem('LM_SEARCH_HISTORY', sarchHistory)
  },
  getSearchHistory () {
    let sarchHistory = window.localStorage.getItem('LM_SEARCH_HISTORY')
    return sarchHistory || []
  },
}