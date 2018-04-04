import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker'
import App from './App'
import Recommend from './view/Recommend/Recommend'
import AlbumInfo from './view/AlbumInfo/AlbumInfo'
import PlayListInfo from './view/PlayListInfo/PlayListInfo'
import Rank from './view/Rank/Rank'
import RankInfo from './view/RankInfo/RankInfo'
import './styles/index.scss'

ReactDOM.render((
  <Router>
    <div className="router-wrap">
      <App />
      <Route exact path="/" component={Recommend} />
      <Route path="/AlbumInfo/:mid" component={AlbumInfo} />
      <Route path="/PlayListInfo/:id" component={PlayListInfo} />
      <Route path="/Rank" component={Rank} />
      <Route path="/RankInfo/:id" component={RankInfo} />
    </div>
  </Router>
), document.getElementById('root'))
registerServiceWorker()
