import React, { Component } from 'react'
import './Recommend.scss'
import CarouselComponent from '../../components/Carousel/Carousel'
import Album from '../../components/Album/Album'
import PlayList from '../../components/PlayList/PlayList'

export default class Recommend extends Component {
  render() {
    return (
      <div>
        <CarouselComponent />
        <Album />
        <PlayList />
      </div>
    )
  }
}
