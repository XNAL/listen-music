import React, { Component } from 'react'
import './Carousel.scss'
import fetch from '../../fetch/index'
import { Carousel } from 'antd-mobile'

export default class CarouselComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sliders: [],
      selectedIndex: 1 // 修改selectedIndex值，不然无法自动播放
    }
  }
  componentDidMount() {
    fetch.getRecommend()
      .then(res => {
        this.setState({
          sliders: res.data.slider,
          selectedIndex: 0
        })
      })
  }
  render() {
    return (
      <Carousel className="carousel-component"
        autoplay
        infinite
        selectedIndex={this.state.selectedIndex}
      >
        {this.state.sliders.map(val => (
          <a className="carousel-link"
            key={val.id}
            href={val.linkUrl}
          >
            <img className="carousel-img"
              src={val.picUrl}
              alt=""
            />
          </a>
        ))}
      </Carousel>
    )
  }
}
