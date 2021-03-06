import {request} from './request'

/* 获取首页数据 */
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

/* 首页商品列表数据 */
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}