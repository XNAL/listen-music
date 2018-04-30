const Koa = require('koa')
const route = require('koa-route')
const axios = require('axios')
const Base64 = require('js-base64')
const app = new Koa()

const PORT = 8000

app.use(route.get('/getPlayListInfo', async ctx => {
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  try {
    let res = await axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/n/yqq/playlist/3602407677.html',
        host: 'c.y.qq.com'
      },
      params: ctx.request.query
    })
    ctx.body = {
      success: true,
      data: res.data
    }
  } catch (error) {
    ctx.body = {
      success: false,
      errMsg: error
    }
  }
}))

app.use(route.get('/getSongLyric', async ctx => {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  try {
    let res = await axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/portal/player.html',
        host: 'c.y.qq.com'
      },
      params: ctx.request.query
    })
    let data = eval(res.data)
    ctx.body = {
      success: true,
      data: data
    }
  } catch (error) {
    ctx.body = {
      success: false,
      errMsg: error
    }
  }
}))

function MusicJsonCallback_lrc(data){
  let lyric = Base64.Base64.decode(data.lyric)
  return lyric
}

app.listen(PORT)
console.log('This server of proxy is listening the port:', PORT)