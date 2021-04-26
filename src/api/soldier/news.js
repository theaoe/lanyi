import request from '@/utils/request'

// 查询新闻动态管理列表
export function listNews(query) {
  return request({
    url: '/soldier/news/list',
    method: 'get',
    params: query
  })
}

// 查询新闻动态管理详细
export function getNews(newsId) {
  return request({
    url: '/soldier/news/' + newsId,
    method: 'get'
  })
}

// 新增新闻动态管理
export function addNews(data) {
  return request({
    url: '/soldier/news',
    method: 'post',
    data: data
  })
}

// 修改新闻动态管理
export function updateNews(data) {
  return request({
    url: '/soldier/news',
    method: 'put',
    data: data
  })
}

// 删除新闻动态管理
export function delNews(newsId) {
  return request({
    url: '/soldier/news/' + newsId,
    method: 'delete'
  })
}

// 导出新闻动态管理
export function exportNews(query) {
  return request({
    url: '/soldier/news/export',
    method: 'get',
    params: query
  })
}