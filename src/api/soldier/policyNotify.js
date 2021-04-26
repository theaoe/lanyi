import request from '@/utils/request'

// 查询政策法规推送通知列表
export function listPolicyNotify(query) {
  return request({
    url: '/soldier/policyNotify/list',
    method: 'get',
    params: query
  })
}

// 查询政策法规推送通知详细
export function getPolicyNotify(policyNotifyId) {
  return request({
    url: '/soldier/policyNotify/' + policyNotifyId,
    method: 'get'
  })
}

// 新增政策法规推送通知
export function addPolicyNotify(data) {
  return request({
    url: '/soldier/policyNotify',
    method: 'post',
    data: data
  })
}

// 修改政策法规推送通知
export function updatePolicyNotify(data) {
  return request({
    url: '/soldier/policyNotify',
    method: 'put',
    data: data
  })
}

// 删除政策法规推送通知
export function delPolicyNotify(policyNotifyId) {
  return request({
    url: '/soldier/policyNotify/' + policyNotifyId,
    method: 'delete'
  })
}

// 导出政策法规推送通知
export function exportPolicyNotify(query) {
  return request({
    url: '/soldier/policyNotify/export',
    method: 'get',
    params: query
  })
}