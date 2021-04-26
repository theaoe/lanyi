import request from '@/utils/request'

// 查询筛查模式管理列表
export function listModule(query) {
  return request({
    url: '/soldier/module/list',
    method: 'get',
    params: query
  })
}

// 查询筛查模式管理详细
export function getModule(id) {
  return request({
    url: '/soldier/module/' + id,
    method: 'get'
  })
}

// 新增筛查模式管理
export function addModule(data) {
  return request({
    url: '/soldier/module',
    method: 'post',
    data: data
  })
}

// 修改筛查模式管理
export function updateModule(data) {
  return request({
    url: '/soldier/module',
    method: 'put',
    data: data
  })
}

// 删除筛查模式管理
export function delModule(id) {
  return request({
    url: '/soldier/module/' + id,
    method: 'delete'
  })
}

// 导出筛查模式管理
export function exportModule(query) {
  return request({
    url: '/soldier/module/export',
    method: 'get',
    params: query
  })
}