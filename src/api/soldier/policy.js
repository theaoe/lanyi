import request from '@/utils/request'

// 查询政策法规管理列表
export function listPolicy(query) {
  return request({
    url: '/soldier/policy/list',
    method: 'get',
    params: query
  })
}

// 查询政策法规管理详细
export function getPolicy(policyId) {
  return request({
    url: '/soldier/policy/' + policyId,
    method: 'get'
  })
}

// 新增政策法规管理
export function addPolicy(data) {
  return request({
    url: '/soldier/policy',
    method: 'post',
    data: data
  })
}

// 修改政策法规管理
export function updatePolicy(data) {
  return request({
    url: '/soldier/policy',
    method: 'put',
    data: data
  })
}

// 删除政策法规管理
export function delPolicy(policyId) {
  return request({
    url: '/soldier/policy/' + policyId,
    method: 'delete'
  })
}

// 导出政策法规管理
export function exportPolicy(query) {
  return request({
    url: '/soldier/policy/export',
    method: 'get',
    params: query
  })
}