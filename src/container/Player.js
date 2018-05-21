import {connect} from 'react-redux'
import { setCurrentSong, setPlayStatus, setShowPlayer, setPlayMode } from '../redux/actions'
import Player from '../components/Play/Player'

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentSong: state.song,
  playStatus: state.playStatus,
  showPlayer: state.showPlayer,
  songList: state.songList,
  playMode: state.playMode
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
  changeSongDuration: (song) => {
    dispatch(setCurrentSong(song))
  },
  changePlayStatus: (status) => {
    dispatch(setPlayStatus(status))
  },
  setShowPlayer: (showPlayer) => {
    dispatch(setShowPlayer(showPlayer))
  },
  playNextSong: (song) => {
    dispatch(setCurrentSong(song))
  },
  setPlayMode: (playMode) => {
    dispatch(setPlayMode(playMode))
  }
})

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Player)