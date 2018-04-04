export const JSONP_URL = {
  // 推荐轮播
  recommend: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  // 最新专辑
  latestAlbum: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
  // 专辑信息
	albumInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
  // 推荐歌单
  playList: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
  // 排行榜
  rankList: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
  // 榜单详情
  rankInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
}

export const JSONP_PARAMS = {
  g_tk: 1658125788,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const JSONP_OPTIONS = {
  param: 'jsonpCallback',
  prefix: 'callback'
}
