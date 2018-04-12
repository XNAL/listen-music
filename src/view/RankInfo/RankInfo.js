import React, { Component } from 'react'
import './RankInfo.scss'
import fetch from '../../fetch/index'

export default class RankInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rankInfo: null
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.playSong = this.playSong.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    
    let id = this.props.match.params.id
    fetch.getRankInfo(id)
      .then(res => {
        console.log(res)
        this.setState({
          rankInfo: res
        })
      })
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll (event) {
    let scrollTop = document.body.scrollTop | document.documentElement.scrollTop
    if (scrollTop >= 144) {
      this.refs.infoBoxRef.style.position = 'fixed'
      this.refs.infoBoxRef.style.top = '-144px'
    } else {
      this.refs.infoBoxRef.style.position = 'relative'
      this.refs.infoBoxRef.style.top = '0'
    }
  }

  handleSinger(singers) {
    let formatSingers = []
    for (let singer of Object.values(singers)) {
      formatSingers.push(singer.name)
    }
    return formatSingers.join(' / ')
  }

  playSong(songInfo) {
    console.log('songInfo', songInfo)
    this.props.playSong(songInfo)
  }
  render() {
    const isExistData = this.state.rankInfo !== null
    if (isExistData) {
      return (
          <section className="rank-info">
            <section className="rank-info-box" ref="infoBoxRef">
              <section className="rank-info-section">
                <div className="rank-info-cover">
                  <img src={`https://y.gtimg.cn/music/photo_new/T002R150x150M000${this.state.rankInfo.songlist[0].data.albummid}.jpg?max_age=2592000`} alt="专辑图片" />
                </div>
                <div className="rank-info-name-author">
                  <h1 className="rank-info-name">{this.state.rankInfo.topinfo.ListName}</h1>
                  <div className="rank-info-author">
                    <div className="author-name">
                      <span>第{this.state.rankInfo.day_of_year}天</span>
                    </div>
                  </div>
                  <p className="rank-info-time">{this.state.rankInfo.date} 更新</p>
                </div>
              </section>
              <img className="rank-info-backImg" src={`https://y.gtimg.cn/music/photo_new/T002R150x150M000${this.state.rankInfo.songlist[0].data.albummid}.jpg?max_age=2592000)`} alt="专辑图片" />
              <div className="opt-box">
                <span className="play-all-btn">播放全部</span>
              </div>
            </section>
            <section className="rank-song-list-section">
              <p className="rank-song-list-title">排行榜<span className="song-num">共{this.state.rankInfo.cur_song_num}首</span></p>
              <ul className="rank-song-list">
                {
                  this.state.rankInfo.songlist.map((val, index) => (
                    <li className="rank-song-item" key={val.data.songid} onClick={() => this.playSong(val.data)}>
                      <div className="rank-song-order">{index + 1}</div>
                      <div className="rank-song-info">
                        <h3 className="rank-song-name txt-nowrap">{val.data.songname}</h3>
                        <p className="rank-song-singer txt-nowrap">{this.handleSinger(val.data.singer)}</p>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </section>
            {
              this.state.rankInfo.desc !== '' &&
              <section className="rank-desc">
                <h2 className="rank-desc-title">简介</h2>
                <p className="rank-desc-content" dangerouslySetInnerHTML={{__html: this.state.rankInfo.topinfo.info}} />
              </section>
            }
          </section>
      )
    } else {
      return (<div />)
    }
  }
}
