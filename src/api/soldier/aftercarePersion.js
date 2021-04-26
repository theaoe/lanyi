import request from '@/utils/request'

// 查询安置人员管理列表
export function listAftercarePersion(query) {
  return request({
    url: '/soldier/aftercarePersion/list',
    method: 'get',
    params: query
  })
}

// 查询安置人员管理详细
export function getAftercarePersion(aftercarePersionId) {
  return request({
    url: '/soldier/aftercarePersion/' + aftercarePersionId,
    method: 'get'
  })
}

// 新增安置人员管理
export function addAftercarePersion(data) {
  return request({
    url: '/soldier/aftercarePersion',
    method: 'post',
    data: data
  })
}

// 修改安置人员管理
export function updateAftercarePersion(data) {
  return request({
    url: '/soldier/aftercarePersion',
    method: 'put',
    data: data
  })
}

// 删除安置人员管理
export function delAftercarePersion(aftercarePersionId) {
  return request({
    url: '/soldier/aftercarePersion/' + aftercarePersionId,
    method: 'delete'
  })
}

// 导出安置人员管理
export function exportAftercarePersion(query) {
  return request({
    url: '/soldier/aftercarePersion/export',
    method: 'get',
    params: query
  })
}