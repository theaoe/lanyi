import request from '@/utils/request'

// 查询培训信息管理列表
export function listTrainInfo(query) {
  return request({
    url: '/soldier/trainInfo/list',
    method: 'get',
    params: query
  })
}

// 查询培训信息管理详细
export function getTrainInfo(trainInfoId) {
  return request({
    url: '/soldier/trainInfo/' + trainInfoId,
    method: 'get'
  })
}

// 新增培训信息管理
export function addTrainInfo(data) {
  return request({
    url: '/soldier/trainInfo',
    method: 'post',
    data: data
  })
}

// 修改培训信息管理
export function updateTrainInfo(data) {
  return request({
    url: '/soldier/trainInfo',
    method: 'put',
    data: data
  })
}

// 删除培训信息管理
export function delTrainInfo(trainInfoId) {
  return request({
    url: '/soldier/trainInfo/' + trainInfoId,
    method: 'delete'
  })
}

// 导出培训信息管理
export function exportTrainInfo(query) {
  return request({
    url: '/soldier/trainInfo/export',
    method: 'get',
    params: query
  })
}