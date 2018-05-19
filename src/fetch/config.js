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
  rankInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
  // 歌手列表
  singerList: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
  // 歌手详情
  singerInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
  // 获取歌曲Vkey
  songVkey: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
  // 获取歌词
  songLyric: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
  // 热搜
  hotKey: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
  // 搜索
  search: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
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
