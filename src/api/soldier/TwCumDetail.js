import request from '@/utils/request'

// 查询筛查方案管理列表
export function listTwCumDetail(query) {
  return request({
    url: '/soldier/TwCumDetail/list',
    method: 'get',
    params: query
  })
}

// 查询筛查方案管理详细
export function getTwCumDetail(id) {
  return request({
    url: '/soldier/TwCumDetail/' + id,
    method: 'get'
  })
}

// 新增筛查方案管理
export function addTwCumDetail(data) {
  return request({
    url: '/soldier/TwCumDetail',
    method: 'post',
    data: data
  })
}

// 修改筛查方案管理
export function updateTwCumDetail(data) {
  return request({
    url: '/soldier/TwCumDetail',
    method: 'put',
    data: data
  })
}

// 删除筛查方案管理
export function delTwCumDetail(id) {
  return request({
    url: '/soldier/TwCumDetail/' + id,
    method: 'delete'
  })
}

// 导出筛查方案管理
export function exportTwCumDetail(query) {
  return request({
    url: '/soldier/TwCumDetail/export',
    method: 'get',
    params: query
  })
}