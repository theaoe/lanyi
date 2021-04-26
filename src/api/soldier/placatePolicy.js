import request from '@/utils/request'

// 查询优抚政策管理列表
export function listPlacatePolicy(query) {
  return request({
    url: '/soldier/placatePolicy/list',
    method: 'get',
    params: query
  })
}

// 查询优抚政策管理详细
export function getPlacatePolicy(placatePolicyId) {
  return request({
    url: '/soldier/placatePolicy/' + placatePolicyId,
    method: 'get'
  })
}

// 新增优抚政策管理
export function addPlacatePolicy(data) {
  return request({
    url: '/soldier/placatePolicy',
    method: 'post',
    data: data
  })
}

// 修改优抚政策管理
export function updatePlacatePolicy(data) {
  return request({
    url: '/soldier/placatePolicy',
    method: 'put',
    data: data
  })
}

// 删除优抚政策管理
export function delPlacatePolicy(placatePolicyId) {
  return request({
    url: '/soldier/placatePolicy/' + placatePolicyId,
    method: 'delete'
  })
}

// 导出优抚政策管理
export function exportPlacatePolicy(query) {
  return request({
    url: '/soldier/placatePolicy/export',
    method: 'get',
    params: query
  })
}