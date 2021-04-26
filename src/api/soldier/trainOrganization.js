import request from '@/utils/request'

// 查询培训机构管理列表
export function listTrainOrganization(query) {
  return request({
    url: '/soldier/trainOrganization/list',
    method: 'get',
    params: query
  })
}

// 查询培训机构管理详细
export function getTrainOrganization(trainOrganizationId) {
  return request({
    url: '/soldier/trainOrganization/' + trainOrganizationId,
    method: 'get'
  })
}

// 新增培训机构管理
export function addTrainOrganization(data) {
  return request({
    url: '/soldier/trainOrganization',
    method: 'post',
    data: data
  })
}

// 修改培训机构管理
export function updateTrainOrganization(data) {
  return request({
    url: '/soldier/trainOrganization',
    method: 'put',
    data: data
  })
}

// 删除培训机构管理
export function delTrainOrganization(trainOrganizationId) {
  return request({
    url: '/soldier/trainOrganization/' + trainOrganizationId,
    method: 'delete'
  })
}

// 导出培训机构管理
export function exportTrainOrganization(query) {
  return request({
    url: '/soldier/trainOrganization/export',
    method: 'get',
    params: query
  })
}