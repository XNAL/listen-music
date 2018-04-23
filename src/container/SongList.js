import {connect} from 'react-redux'
import { setCurrentSong, setSongList, setPlayMode } from '../redux/actions'
import SongList from '../components/SongList/SongList'

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentSong: state.song,
  songList: state.songList,
  playMode: state.playMode
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
  playSong: (song) => {
    dispatch(setCurrentSong(song))
  },
  setSongList: (songList) => {
    dispatch(setSongList(songList))
  },
  setPlayMode: (playMode) => {
    dispatch(setPlayMode(playMode))
  }
})

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(SongList)