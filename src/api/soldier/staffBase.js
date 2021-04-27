import request from '@/utils/request'

// 查询人员基础信息列表
export function listStaffBase(query) {
  return request({
    url: '/soldier/staffBase/list',
    method: 'get',
    params: query
  })
}

// 固定筛选统计信息查询
export function listStaffBaseForFixed(query) {
  return request({
    url: '/soldier/staffBase/listForFixed',
    method: 'get',
    params: query
  })
}

// 查询人员基础信息详细
export function getStaffBase(staffId) {
  return request({
    url: '/soldier/staffBase/' + staffId,
    method: 'get'
  })
}
// 查询人员基础信息详细 新
export function getStaffBaseFile(staffId) {
  return request({
    url: '/soldier/staffBaseFile/' + staffId,
    method: 'get'
  })
}
// 修改人员基础信息新
export function updateStaffBaseFile(data) {
  return request({
    url: '/soldier/staffBaseFile',
    method: 'put',
    data: data
  })
}

// 新增人员基础信息
export function addStaffBase(data) {
  return request({
    url: '/soldier/staffBase',
    method: 'post',
    data: data
  })
}

// 修改人员基础信息
export function updateStaffBase(data) {
  return request({
    url: '/soldier/staffBase',
    method: 'put',
    data: data
  })
}

// 删除人员基础信息
export function delStaffBase(staffId) {
  return request({
    url: '/soldier/staffBase/' + staffId,
    method: 'delete'
  })
}

// 导出人员基础信息
export function exportStaffBase(query) {
  return request({
    url: '/soldier/staffBase/export',
    method: 'get',
    params: query
  })
}
// 导出人员基础信息
export function exportForFixed(query) {
  return request({
    url: '/soldier/staffBase/exportForFixed',
    method: 'get',
    params: query
  })
}

// 下载人员基础信息导入模板
export function importTemplate() {
  return request({
    url: '/soldier/staffBase/getExcelModule',
    method: 'get'
  })
}