import jsonp from 'jsonp'
import fetch from 'axios'

// params参数对象拼接到url上
function formatUrl (url, params) {
  let arrParams = []
  for(let [key, value] of Object.entries(params)) {
    arrParams.push(`${key}=${value}`)
  }
  let strParam = arrParams.join('&')
  if (url.indexOf('?') === -1) {
    return `${url}?${strParam}`
  } else {
    return `${url}&${strParam}`
  }
}

export function fetchApi (url, params) {
  return fetch(formatUrl(url, params), {
    method: 'GET'
  })
}

// 使用promise封装jsonp
export function fetchJsonp(url, options, params) {
  return new Promise((resolve, reject) => {
    jsonp(formatUrl(url, params), options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  });
}