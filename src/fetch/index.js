import { fetchApi, fetchJsonp } from './fetch'
import { JSONP_URL, JSONP_PARAMS, JSONP_OPTIONS } from './config'

export default {
  /**
   * @method 获取首页推荐轮播信息
   * @type jsonp
   * @return json
   */
  getRecommend () {
    let params = Object.assign({}, JSONP_PARAMS, {
      platform: 'h5',
      uin: 772528797,
      needNewCode: 1,
      _: new Date().getTime()
    })
    return fetchJsonp(JSONP_URL.recommend, JSONP_OPTIONS, params)
  },
  /**
   * @method 获取最新专辑
   * @type jsonp
   * @return json
   */
  getLatestAlbum () {
    let albumlib = {
      method: 'get_album_by_tags',
      param: {
        area: 7,
        company: -1,
        genre: -1,
        type: -1,
        year: -1,
        sort: 2,
        get_tags: 1,
        sin: 0,
        num: 50,
        click_albumid: 0
      },
      module: 'music.web_album_library'
    }
    let data = Object.assign({}, JSONP_PARAMS, {
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      data: `{
        "albumlib": ${JSON.stringify(albumlib)}
      }`
    })
    let option = {
      param: "callback",
      prefix: "callback"
    }
    return fetchJsonp(JSONP_URL.latestAlbum, option, data);
  },
  /**
   * @method 获取专辑详情
   * @type jsonp
   * @return json
   */
  getAlbumInfo (albumId) {
    let data = Object.assign({}, JSONP_PARAMS, {
      g_tk: 33480508,
      albummid: albumId,
      hostUin: 0,
      platform: "yqq",
      needNewCode: 0
    })
    return fetchJsonp(JSONP_URL.albumInfo, JSONP_OPTIONS, data);
  },
  /**
   * @method 获取推荐歌单
   * @type jsonp
   * @return json
   */
  getPlayList () {
    let playList = {
      comm: {
        ct: 24
      },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: {
          async: 1,
          cmd: 2
        },
        module: 'playlist.HotRecommendServer'
      }
    }
    let data = Object.assign({}, JSONP_PARAMS, {
      callback: 'recom46834914305012054',
      g_tk: 1492455586,
      jsonpCallback: 'recom46834914305012054',
      loginUin: 772528797,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      data: JSON.stringify(playList)
    })
    return fetchJsonp(JSONP_URL.playList, {}, data);
  },
  /**
   * @method 获取歌单详情
   * @type jsonp
   * @return json
   */
  getPlayListInfo (id, pageIndex = 0) {
    let params = Object.assign({}, JSONP_PARAMS, {
      format: 'json',
      uin: 772528797,
      platform: 'h5',
      needNewCode: 1,
      new_format: 1,
      pic: 500,
      disstid: id,
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      picmid: 1,
      nosign: 1,
      song_begin: pageIndex,
      song_num: 15,
      _: new Date().getTime()
    })
    return fetchApi('/proxyApi/getPlayListInfo', params)
  },
  /**
   * @method 获取排行榜
   * @type jsonp
   * @return json
   */
  getRankList () {
    let params = Object.assign({}, JSONP_PARAMS, {
      // format: 'json',
      g_tk: 5381,
      uin: 0,
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: new Date().getTime()
    })
    return fetchJsonp(JSONP_URL.rankList, JSONP_OPTIONS, params)
  }
}
  
