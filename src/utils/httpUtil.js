// 网络通信
import fecth from "isomorphic-fetch"
// const basicUrl = 'http://172.16.120.250:7786/crmserver/'
const basicUrl = 'http://wechat.xingyun361.com/quasarserverdev/common/proxy'
// const basicUrl = 'http://mobileapp.xingyun361.com/quasarserver/common/proxy'
// const projectUrl = 'http://192.168.80.200:8080/crmserver/'
function serializeformQuery (requestParams) {
  let query = ''
  for (let param in requestParams) {
    if (param !== undefined && param !== '') {
      query += param + '=' + requestParams[param] + '&'
    }
  }
  if (query !== '') {
    query = query.substring(0, query.length - 1)
  }
  return query
}
const httpRequest = {
  post (url, params, type = 'get') {
    let param = new FormData()
    param.append('reqUrl', url)
    param.append('charset', 'utf8')
    param.append('type', type)
    param.append('params', serializeformQuery(params))
    console.log(param)
    return new Promise((resolve, reject) => {
      fecth(basicUrl, {
        method: 'POST',
        body: param
      }).then((resp) => {
        console.log(resp)
        if (resp.status === 200) {
          resolve(resp.json())
        } else {
          reject(new Error(resp.statusText))
        }
      }).catch(ex => {
        reject(ex)
      }).done()
    })
  }
}

export default httpRequest