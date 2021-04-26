import request from '@/utils/request'

// 查询安置单位信息列表
export function listAftercareUnit(query) {
  return request({
    url: '/soldier/aftercareUnit/list',
    method: 'get',
    params: query
  })
}

// 查询安置单位信息详细
export function getAftercareUnit(unitId) {
  return request({
    url: '/soldier/aftercareUnit/' + unitId,
    method: 'get'
  })
}

// 新增安置单位信息
export function addAftercareUnit(data) {
  return request({
    url: '/soldier/aftercareUnit',
    method: 'post',
    data: data
  })
}

// 修改安置单位信息
export function updateAftercareUnit(data) {
  return request({
    url: '/soldier/aftercareUnit',
    method: 'put',
    data: data
  })
}

// 删除安置单位信息
export function delAftercareUnit(unitId) {
  return request({
    url: '/soldier/aftercareUnit/' + unitId,
    method: 'delete'
  })
}

// 导出安置单位信息
export function exportAftercareUnit(query) {
  return request({
    url: '/soldier/aftercareUnit/export',
    method: 'get',
    params: query
  })
}