import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker'
import './styles/index.scss'
import App from './App'
import AlbumInfo from './view/AlbumInfo/AlbumInfo'

ReactDOM.render((
  <Router>
    <div className="router-wrap">
      <Route exact path="/" component={App} />
      <Route path="/AlbumInfo/:mid" component={AlbumInfo} />
    </div>
  </Router>
), document.getElementById('root'))
registerServiceWorker()
