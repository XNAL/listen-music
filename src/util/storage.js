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
  }
}