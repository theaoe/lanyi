import request from '@/utils/request'

// 查询培训报名管理列表
export function listTrainEnroll(query) {
  return request({
    url: '/soldier/trainEnroll/list',
    method: 'get',
    params: query
  })
}

// 查询培训报名管理详细
export function getTrainEnroll(trainEnrollId) {
  return request({
    url: '/soldier/trainEnroll/' + trainEnrollId,
    method: 'get'
  })
}

// 新增培训报名管理
export function addTrainEnroll(data) {
  return request({
    url: '/soldier/trainEnroll',
    method: 'post',
    data: data
  })
}

// 修改培训报名管理
export function updateTrainEnroll(data) {
  return request({
    url: '/soldier/trainEnroll',
    method: 'put',
    data: data
  })
}

// 删除培训报名管理
export function delTrainEnroll(trainEnrollId) {
  return request({
    url: '/soldier/trainEnroll/' + trainEnrollId,
    method: 'delete'
  })
}

// 导出培训报名管理
export function exportTrainEnroll(query) {
  return request({
    url: '/soldier/trainEnroll/export',
    method: 'get',
    params: query
  })
}