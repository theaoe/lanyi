import request from '@/utils/request'

// 查询优抚慰问记录列表
export function listPlacateCondolences(query) {
  return request({
    url: '/soldier/placateCondolences/list',
    method: 'get',
    params: query
  })
}

// 查询优抚慰问记录详细
export function getPlacateCondolences(placateCondolencesId) {
  return request({
    url: '/soldier/placateCondolences/' + placateCondolencesId,
    method: 'get'
  })
}

// 新增优抚慰问记录
export function addPlacateCondolences(data) {
  return request({
    url: '/soldier/placateCondolences',
    method: 'post',
    data: data
  })
}

// 修改优抚慰问记录
export function updatePlacateCondolences(data) {
  return request({
    url: '/soldier/placateCondolences',
    method: 'put',
    data: data
  })
}

// 删除优抚慰问记录
export function delPlacateCondolences(placateCondolencesId) {
  return request({
    url: '/soldier/placateCondolences/' + placateCondolencesId,
    method: 'delete'
  })
}

// 导出优抚慰问记录
export function exportPlacateCondolences(query) {
  return request({
    url: '/soldier/placateCondolences/export',
    method: 'get',
    params: query
  })
}