import { connect } from 'react-redux'
import { setCurrentSong } from '../redux/actions'
import RankInfo from "../view/RankInfo/RankInfo"

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // song: state.song
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
  playSong: (song) => {
    dispatch(setCurrentSong(song))
  }
})

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(RankInfo)