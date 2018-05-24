import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Singer.scss'
import fetch from '../../fetch/index'
import SingerCategory from '../../components/SingerCategory/SingerCategory'
import singerDefault from '../../assets/singer_default.png'
import Loading from '../../components/Loading/Loading'

const singerTags = [
  { key: 'all_all', value: '全部' },
  { key: 'cn_man', value: '华语男' },
  { key: 'cn_woman', value: '华语女' },
  { key: 'cn_team', value: '华语组合' },
  { key: 'k_man', value: '韩国男' },
  { key: 'k_woman', value: '韩国女' },
  { key: 'k_team', value: '韩国组合' },
  { key: 'j_man', value: '日本男' },
  { key: 'j_woman', value: '日本女' },
  { key: 'j_team', value: '日本组合' },
  { key: 'eu_man', value: '欧美男' },
  { key: 'eu_woman', value: '欧美女' },
  { key: 'eu_team', value: '欧美组合' },
  { key: 'c_orchestra', value: '乐团' },
  { key: 'c_performer', value: '演奏家' },
  { key: 'c_composer', value: '作曲家' },
  { key: 'c_cantor', value: '指挥家' },
  { key: 'other_other', value: '其他' }
]

const letterList = [
  { key: 'all', value: '热门' },
  { key: 'A', value: 'A' },
  { key: 'B', value: 'B' },
  { key: 'C', value: 'C' },
  { key: 'D', value: 'D' },
  { key: 'E', value: 'E' },
  { key: 'F', value: 'F' },
  { key: 'G', value: 'G' },
  { key: 'H', value: 'H' },
  { key: 'I', value: 'I' },
  { key: 'J', value: 'J' },
  { key: 'K', value: 'K' },
  { key: 'L', value: 'L' },
  { key: 'M', value: 'M' },
  { key: 'N', value: 'N' },
  { key: 'O', value: 'O' },
  { key: 'P', value: 'P' },
  { key: 'Q', value: 'Q' },
  { key: 'R', value: 'R' },
  { key: 'S', value: 'S' },
  { key: 'T', value: 'T' },
  { key: 'U', value: 'U' },
  { key: 'V', value: 'V' },
  { key: 'W', value: 'W' },
  { key: 'X', value: 'X' },
  { key: 'Y', value: 'Y' },
  { key: 'Z', value: 'Z' },
  { key: '9', value: '#' }
]

export default class Singer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singerList: [],
      isLoading: false,
      pageNum: 1,
      isEnd: false,
      key: 'all_all_all',
      tagKey: 'all_all',
      letterKey: 'all',
      viewPortHeight: document.documentElement.clientHeight,
      singerTags: singerTags,
      letterList: letterList
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.changeLetter = this.changeLetter.bind(this)
    this.changeSingerTag = this.changeSingerTag.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.setState({
      isLoading: true,
    }, () => {
      this.fetchSinger()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll (event) {
    let scrollTop = document.body.scrollTop | document.documentElement.scrollTop
    let listHeight = this.refs.infoBoxRef.clientHeight
    if ((listHeight - this.state.viewPortHeight - scrollTop <= 100) && !this.state.isEnd && !this.state.isLoading) {
      let pageNum = this.state.pageNum
      pageNum ++
      this.setState({
        isLoading: true,
        pageNum: pageNum
      }, () => {
        this.fetchSinger()
      })
    }
  }

  fetchSinger () {
    let key = `${this.state.tagKey}_${this.state.letterKey}`
    fetch.getSingerList(this.state.pageNum, key)
      .then(res => {
        let isEnd = false
        if (this.state.pageNum >= res.data.total_page) {
          isEnd = true
        }
        let singerList = this.state.singerList
        if (this.state.pageNum === 1) {
          singerList = []
        } 
        singerList = singerList.concat(res.data.list)
        this.setState({
          singerList: singerList,
          isLoading: false,
          isEnd: isEnd
        })
      })
  }
  
  changeLetter (letter) {
    if (letter !== this.state.letterKey)
    {
      this.setState({
        letterKey: letter,
        pageNum: 1,
        isLoading: true,
        isEnd: false
      }, () => {
        this.fetchSinger()
      })
    }
  }

  changeSingerTag (singerTag) {
    if (singerTag !== this.state.tagKey)
    {
      this.setState({
        tagKey: singerTag,
        pageNum: 1,
        isLoading: true,
        isEnd: false
      }, () => {
        this.fetchSinger()
      })
    }

  }

  render() {
    return (
      <section className="singer-section">
      <SingerCategory categoryList = {this.state.singerTags}
          callbackParent={this.changeSingerTag}/>
      <SingerCategory categoryList = {this.state.letterList}
        callbackParent={this.changeLetter}/>
        <ul className="singer-list" ref="infoBoxRef">
          {
            this.state.singerList.map(val => (
              <li className="singer-item" key={val.Fsinger_id}>
                <Link to={`/SingerInfo/${val.Fsinger_id}`} className="singer-jump">
                  <div className="singer-img">
                    <img src={`https://y.gtimg.cn/music/photo_new/T001R150x150M000${val.Fsinger_mid}.jpg?max_age=2592000`} onError={(e) => { e.target.src = singerDefault }} alt="pic" />
                  </div>
                  <p className="singer-name">{val.Fsinger_name}</p>
                </Link>
              </li>
            ))
          }
        </ul>
        {
          this.state.isLoading &&
          <div className="list-loading">
            <Loading />
          </div>
        }
      </section>
    )
  }
}
