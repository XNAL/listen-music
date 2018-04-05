import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Singer.scss'
import fetch from '../../fetch/index'

export default class Singer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singerList: [],
      isLoading: false,
      pageNum: 1,
      isEnd: false,
      key: 'all_all_all',
      viewPortHeight: document.documentElement.clientHeight
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.fetchSinger()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll (event) {
    let scrollTop = document.body.scrollTop | document.documentElement.scrollTop
    let listHeight = this.refs.infoBoxRef.clientHeight
    // console.log(this.refs.infoBoxRef.clientHeight, scrollTop)
    console.log(listHeight, scrollTop, (listHeight - this.state.viewPortHeight - scrollTop), !this.state.isEnd, !this.state.isLoading)
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
    fetch.getSingerList(this.state.pageNum, this.state.key)
      .then(res => {
        let isEnd = false
        if (this.state.pageNum >= res.data.total_page) {
          isEnd = true
        }
        this.setState({
          singerList: this.state.singerList.concat(res.data.list),
          isLoading: false,
          isEnd: isEnd
        })
      })
  }

  render() {
    return (
      <section className="singer-section">
        <ul className="singer-list" ref="infoBoxRef">
          {
            this.state.singerList.map(val => (
              <li className="singer-item" key={val.Fsinger_id}>
                <Link to={`/SingerInfo/${val.Fsinger_id}`} className="singer-jump">
                  <div className="singer-img">
                    <img src={`https://y.gtimg.cn/music/photo_new/T001R150x150M000${val.Fsinger_mid}.jpg?max_age=2592000)`} alt="排行榜图片" />
                  </div>
                  <p className="singer-name">{val.Fsinger_name}</p>
                </Link>
              </li>
            ))
          }
        </ul>
      </section>
    )
  }
}
