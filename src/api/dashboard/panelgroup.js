import request from '@/utils/request'

// 查询已安置人数
export function getAzCount(query) {
    return request({
        url: '/soldier/home/getAzCount',
        method: 'get',
        params: query
    })
}

// 查询培训人次
export function getPxCount(query) {
    return request({
        url: '/soldier/home/getPxCount',
        method: 'get',
        params: query
    })
}

// 查询优抚慰问人次
export function getYfCount(query) {
    return request({
        url: '/soldier/home/getYfCount',
        method: 'get',
        params: query
    })
}

// 查询退伍军人总数
export function getTwCount(query) {
    return request({
        url: '/soldier/home/getTwCount',
        method: 'get',
        params: query
    })
}


// 查询年新增退伍军人统计z
export function getTwEchartCount(query) {
    return request({
        url: '/soldier/home/getTwEchartCount',
        method: 'get',
        params: query
    })
}

// 查询年新增退伍军人统计
export function getPxEchartCount(query) {
    return request({
        url: '/soldier/home/getPxEchartCount',
        method: 'get',
        params: query
    })
}


// 查询退伍军人总数饼图
export function getTwCount1(query) {
    return request({
        url: '/soldier/home/getTwCount1',
        method: 'get',
        params: query
    })
}

// 查询退伍军人总数饼图
export function getYfCount1(query) {
    return request({
        url: '/soldier/home/getYfCount1',
        method: 'get',
        params: query
    })
}