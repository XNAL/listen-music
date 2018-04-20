import { connect } from 'react-redux'
import { setCurrentSong, setPlayStatus, setSongList } from '../redux/actions'
import PlayListInfo from "../view/PlayListInfo/PlayListInfo"

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // song: state.song
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
  playSong: (song) => {
    dispatch(setCurrentSong(song))
  },
  setPlayStatus: (status) => {
    dispatch(setPlayStatus(status))
  },
  setSongList: (songList) => {
    dispatch(setSongList(songList))
  }
})

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(PlayListInfo)