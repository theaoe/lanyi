import request from '@/utils/request'

// 查询人员家庭成员信息列表
export function listStaffFamily(query) {
  return request({
    url: '/soldier/staffFamily/list',
    method: 'get',
    params: query
  })
}

// 查询人员家庭成员信息详细
export function getStaffFamily(staffFamilyId) {
  return request({
    url: '/soldier/staffFamily/' + staffFamilyId,
    method: 'get'
  })
}

// 新增人员家庭成员信息
export function addStaffFamily(data) {
  return request({
    url: '/soldier/staffFamily',
    method: 'post',
    data: data
  })
}

// 修改人员家庭成员信息
export function updateStaffFamily(data) {
  return request({
    url: '/soldier/staffFamily',
    method: 'put',
    data: data
  })
}

// 删除人员家庭成员信息
export function delStaffFamily(staffFamilyId) {
  return request({
    url: '/soldier/staffFamily/' + staffFamilyId,
    method: 'delete'
  })
}

// 导出人员家庭成员信息
export function exportStaffFamily(query) {
  return request({
    url: '/soldier/staffFamily/export',
    method: 'get',
    params: query
  })
}