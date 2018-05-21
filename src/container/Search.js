import { connect } from 'react-redux'
import { setCurrentSong, setPlayStatus, setShowPlayer, setSongList } from '../redux/actions'
import Search from "../view/Search/Search"

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({

})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
  playSong: (song) => {
    dispatch(setCurrentSong(song))
  },
  setShowPlayer: (showPlayer) => {
    dispatch(setShowPlayer(showPlayer))
  },
  setPlayStatus: (status) => {
    dispatch(setPlayStatus(status))
  },
  setSongList: (songList) => {
    dispatch(setSongList(songList))
  }
})

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Search)