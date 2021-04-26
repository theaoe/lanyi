import request from '@/utils/request'

// 查询新闻动态推送通知列表
export function listNewsNotify(query) {
  return request({
    url: '/soldier/newsNotify/list',
    method: 'get',
    params: query
  })
}

// 查询新闻动态推送通知详细
export function getNewsNotify(newsNotifyId) {
  return request({
    url: '/soldier/newsNotify/' + newsNotifyId,
    method: 'get'
  })
}

// 新增新闻动态推送通知
export function addNewsNotify(data) {
  return request({
    url: '/soldier/newsNotify',
    method: 'post',
    data: data
  })
}

// 修改新闻动态推送通知
export function updateNewsNotify(data) {
  return request({
    url: '/soldier/newsNotify',
    method: 'put',
    data: data
  })
}

// 删除新闻动态推送通知
export function delNewsNotify(newsNotifyId) {
  return request({
    url: '/soldier/newsNotify/' + newsNotifyId,
    method: 'delete'
  })
}

// 导出新闻动态推送通知
export function exportNewsNotify(query) {
  return request({
    url: '/soldier/newsNotify/export',
    method: 'get',
    params: query
  })
}