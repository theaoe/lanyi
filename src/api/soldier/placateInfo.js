import request from '@/utils/request'

// 查询优抚信息管理列表
export function listPlacateInfo(query) {
  return request({
    url: '/soldier/placateInfo/list',
    method: 'get',
    params: query
  })
}

// 查询优抚信息管理详细
export function getPlacateInfo(placateInfoId) {
  return request({
    url: '/soldier/placateInfo/' + placateInfoId,
    method: 'get'
  })
}

// 新增优抚信息管理
export function addPlacateInfo(data) {
  return request({
    url: '/soldier/placateInfo',
    method: 'post',
    data: data
  })
}

// 修改优抚信息管理
export function updatePlacateInfo(data) {
  return request({
    url: '/soldier/placateInfo',
    method: 'put',
    data: data
  })
}

// 删除优抚信息管理
export function delPlacateInfo(placateInfoId) {
  return request({
    url: '/soldier/placateInfo/' + placateInfoId,
    method: 'delete'
  })
}

// 导出优抚信息管理
export function exportPlacateInfo(query) {
  return request({
    url: '/soldier/placateInfo/export',
    method: 'get',
    params: query
  })
}