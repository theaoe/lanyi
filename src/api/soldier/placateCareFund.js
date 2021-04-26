import request from '@/utils/request'

// 查询优抚关爱基金管理列表
export function listPlacateCareFund(query) {
  return request({
    url: '/soldier/placateCareFund/list',
    method: 'get',
    params: query
  })
}

// 查询优抚关爱基金管理详细
export function getPlacateCareFund(placateCareFundId) {
  return request({
    url: '/soldier/placateCareFund/' + placateCareFundId,
    method: 'get'
  })
}

// 新增优抚关爱基金管理
export function addPlacateCareFund(data) {
  return request({
    url: '/soldier/placateCareFund',
    method: 'post',
    data: data
  })
}

// 修改优抚关爱基金管理
export function updatePlacateCareFund(data) {
  return request({
    url: '/soldier/placateCareFund',
    method: 'put',
    data: data
  })
}

// 删除优抚关爱基金管理
export function delPlacateCareFund(placateCareFundId) {
  return request({
    url: '/soldier/placateCareFund/' + placateCareFundId,
    method: 'delete'
  })
}

// 导出优抚关爱基金管理
export function exportPlacateCareFund(query) {
  return request({
    url: '/soldier/placateCareFund/export',
    method: 'get',
    params: query
  })
}