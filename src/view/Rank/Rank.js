import React, { Component } from 'react'
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
        
      })
  }

  render() {
    return (
      <div>rank</div>
    )
  }
}
