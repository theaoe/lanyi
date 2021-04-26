import request from '@/utils/request'

// 查询人员档案信息列表
export function listStaffFile(query) {
  return request({
    url: '/soldier/staffFile/list',
    method: 'get',
    params: query
  })
}

// 查询人员档案信息详细
export function getStaffFile(staffFileId) {
  return request({
    url: '/soldier/staffFile/' + staffFileId,
    method: 'get'
  })
}
// 通过身份证查询人员档案信息详细
export function getStaffFileByIdCard(idCard) {
  return request({
    url: '/soldier/staffFile/idCard/' + idCard,
    method: 'get'
  })
}
// 新增人员档案信息
export function addStaffFile(data) {
  return request({
    url: '/soldier/staffFile',
    method: 'post',
    data: data
  })
}

// 修改人员档案信息
export function updateStaffFile(data) {
  return request({
    url: '/soldier/staffFile',
    method: 'put',
    data: data
  })
}

// 删除人员档案信息
export function delStaffFile(staffFileId) {
  return request({
    url: '/soldier/staffFile/' + staffFileId,
    method: 'delete'
  })
}

// 导出人员档案信息
export function exportStaffFile(query) {
  return request({
    url: '/soldier/staffFile/export',
    method: 'get',
    params: query
  })
}

// 获取省市县村镇
export function getProvince(query) {
  return request({
    url: '/operator/jposition/provice',
    method: 'get',
    params: query
  })
}

export function getCity(query) {
  return request({
    url: '/operator/jposition/city',
    method: 'get',
    params: query
  })
}

export function getCounty(query) {
  return request({
    url: '/operator/jposition/county',
    method: 'get',
    params: query
  })
}

export function getTown(query) {
  return request({
    url: '/operator/jposition/town',
    method: 'get',
    params: query
  })
}

export function getVillage(query) {
  return request({
    url: '/operator/jposition/village',
    method: 'get',
    params: query
  })
}