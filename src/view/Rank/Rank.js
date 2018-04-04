import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Rank.scss'
import fetch from '../../fetch/index'

export default class Rank extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rankList: []
    }
  }

  componentDidMount() {
    fetch.getRankList()
      .then(res => {
        this.setState({
          rankList: res.data.topList
        })
      })
  }

  render() {
    return (
      <section className="rank-section">
        <ul className="rank-list">
          {
            this.state.rankList.map(val => (
              <li className="rank-item" key={val.id}>
                <Link to={`/RankInfo/${val.id}`} className="rank-jump">
                  <div className="rank-img">
                    <img src={val.picUrl} alt="排行榜图片" />
                  </div>
                  <div className="rank-item-info">
                    <h3 className="rank-item-title">{val.topTitle}</h3>
                    {
                      val.songList.map((song, index) => (
                        <p className="rank-item-song" key={index}>
                          <span className="song-order">{index + 1}</span>
                          <span className="song-name">{song.songname}</span>
                          -
                          <span className="singer-name">{song.singername}</span>
                        </p>
                      ))
                    }
                  </div>
                </Link>
              </li>
            ))
          }
        </ul>
      </section>
    )
  }
}
