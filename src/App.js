import React, { Component } from 'react'
import './App.scss'
import NavBar from './components/NavBar/NavBar'
import Recommend from './view/Recommend/Recommend'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Listen Music</h1>
        </header>
        <NavBar />
        <Recommend />
      </div>
    );
  }
}
