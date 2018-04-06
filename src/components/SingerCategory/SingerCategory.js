import React, { Component } from 'react'
import './SingerCategory.scss'

export default class SingerCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'all',
      list: this.props.categoryList || []
    }
    this.changeCategory = this.changeCategory.bind(this)
  }

  changeCategory (value) {
    this.setState({
      active: value
    })
    this.props.callbackParent(value)
  }

  render () {
    return (
      <div className="singer-category">
        <ul className="category-list">
          {
            this.state.list.map(val => (
              <li className={'category-item ' + (this.state.active === val.key ? 'active' : '')} 
                data-value={val.key} key={val.key} onClick={() => this.changeCategory(val.key)}>
                {val.value}
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
