import request from '@/utils/request'

// 查询意见列表
export function listSuggestion(query) {
  return request({
    url: '/soldier/suggestion/list',
    method: 'get',
    params: query
  })
}

// 查询意见详细
export function getSuggestion(suggestionId) {
  return request({
    url: '/soldier/suggestion/' + suggestionId,
    method: 'get'
  })
}

// 新增意见
export function addSuggestion(data) {
  return request({
    url: '/soldier/suggestion',
    method: 'post',
    data: data
  })
}

// 修改意见
export function updateSuggestion(data) {
  return request({
    url: '/soldier/suggestion',
    method: 'put',
    data: data
  })
}

// 删除意见
export function delSuggestion(suggestionId) {
  return request({
    url: '/soldier/suggestion/' + suggestionId,
    method: 'delete'
  })
}

// 导出意见
export function exportSuggestion(query) {
  return request({
    url: '/soldier/suggestion/export',
    method: 'get',
    params: query
  })
}