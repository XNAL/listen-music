import {connect} from "react-redux"
import MiniPlay from "../components/Play/MiniPlay"

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  song: state.song
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
})

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(MiniPlay)