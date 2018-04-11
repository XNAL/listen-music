export default {
  setCurrentSong (song) {
    window.localStorage.setItem('LM_SONG', JSON.stringify(song))
  },
  getCurrentSong () {
    let song = window.localStorage.getItem('LM_SONG')
    console.log('get', song)
    return song ? JSON.parse(song) : {}
  }
}