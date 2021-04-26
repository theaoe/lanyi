import request from '@/utils/request'

// 查询诉求信息管理列表
export function listAppeal(query) {
  return request({
    url: '/soldier/appeal/list',
    method: 'get',
    params: query
  })
}

// 查询诉求信息管理详细
export function getAppeal(appealId) {
  return request({
    url: '/soldier/appeal/' + appealId,
    method: 'get'
  })
}

// 新增诉求信息管理
export function addAppeal(data) {
  return request({
    url: '/soldier/appeal',
    method: 'post',
    data: data
  })
}

// 修改诉求信息管理
export function updateAppeal(data) {
  return request({
    url: '/soldier/appeal',
    method: 'put',
    data: data
  })
}

// 删除诉求信息管理
export function delAppeal(appealId) {
  return request({
    url: '/soldier/appeal/' + appealId,
    method: 'delete'
  })
}

// 导出诉求信息管理
export function exportAppeal(query) {
  return request({
    url: '/soldier/appeal/export',
    method: 'get',
    params: query
  })
}