import request from '@/utils/request'

// 查询安置政策管理列表
export function listAftercarePolicy(query) {
  return request({
    url: '/soldier/aftercarePolicy/list',
    method: 'get',
    params: query
  })
}

// 查询安置政策管理详细
export function getAftercarePolicy(aftercarePolicyId) {
  return request({
    url: '/soldier/aftercarePolicy/' + aftercarePolicyId,
    method: 'get'
  })
}

// 新增安置政策管理
export function addAftercarePolicy(data) {
  return request({
    url: '/soldier/aftercarePolicy',
    method: 'post',
    data: data
  })
}

// 修改安置政策管理
export function updateAftercarePolicy(data) {
  return request({
    url: '/soldier/aftercarePolicy',
    method: 'put',
    data: data
  })
}

// 删除安置政策管理
export function delAftercarePolicy(aftercarePolicyId) {
  return request({
    url: '/soldier/aftercarePolicy/' + aftercarePolicyId,
    method: 'delete'
  })
}

// 导出安置政策管理
export function exportAftercarePolicy(query) {
  return request({
    url: '/soldier/aftercarePolicy/export',
    method: 'get',
    params: query
  })
}