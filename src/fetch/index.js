import fetchJsonp from './jsonp'
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
    });
    let option = {
      param: "callback",
      prefix: "callback"
    };
    return fetchJsonp(JSONP_URL.latestAlbum, option, data);
  }
}
  
