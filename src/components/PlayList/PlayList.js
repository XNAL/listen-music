import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './PlayList.scss'
import fetch from '../../fetch/index'

export default class PlayList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playList: []
    }
  }

  componentDidMount() {
    fetch.getPlayList()
      .then(res => {
        this.setState({
          playList: res.recomPlaylist.data.v_hot.slice(0, 6)
        })
      })
  }

  render() {
    return (
      <div className="playlist-component">
        { this.state.playList.length > 0 && 
          <h2 className="playlist-title">推荐歌单</h2>
        }
        <ul className="playlist-list">
          {this.state.playList.map(val => (
              <li className="playlist-item" key={val.content_id} >
                <Link to={`/PlayListInfo/${val.content_id}`} className="playlist-link">
                  <img className="playlist-img"
                    src={val.cover}
                    alt="歌单图片"
                  />
                  <p className="playlist-name">{val.title}</p>
                </Link>
              </li>
            ))}
        </ul>
      </div>  
    )
  }
}
