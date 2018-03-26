import fetchJsonp from './jsonp'
import { JSONP_URL, JSONP_PARAMS, JSONP_OPTIONS } from './config'

export default {
  /**
   * @method 获取首页推荐轮播信息
   * @type jsonp
   * @return json
   */
  getRecommend() {
    let params = Object.assign({}, JSONP_PARAMS, {
      platform: 'h5',
      uin: 772528797,
      needNewCode: 1,
      _: new Date().getTime()
    })
    return fetchJsonp(JSONP_URL.recommend, JSONP_OPTIONS, params)
  }
}
  
