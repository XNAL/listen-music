import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker'
import App from './App'
import Player from './container/Player'
import Recommend from './view/Recommend/Recommend'
import AlbumInfo from './container/AlbumInfo'
import PlayListInfo from './container/PlayListInfo'
import Rank from './view/Rank/Rank'
import RankInfo from './container/RankInfo'
import Singer from './view/Singer/Singer'
import SingerInfo from './container/SingerInfo'
import Search from './container/Search'
import './styles/index.scss'

import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.render((
<Provider store={store}>
  <Router>
    <div className="router-wrap">
      <App />
      <Route exact path="/" component={Recommend} />
      <Route path="/AlbumInfo/:mid" component={AlbumInfo} />
      <Route path="/PlayListInfo/:id" component={PlayListInfo} />
      <Route path="/Singer" component={Singer} />
      <Route path="/SingerInfo/:id" component={SingerInfo} />
      <Route path="/Rank" component={Rank} />
      <Route path="/RankInfo/:id" component={RankInfo} />
      <Route path="/Search" component={Search} />
      <Player />
    </div>
  </Router>
</Provider>
), document.getElementById('root'))
registerServiceWorker()
