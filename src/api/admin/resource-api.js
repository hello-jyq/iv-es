import { request } from '@/utils/request'
// 获取资源列表
export function getResList(params) {
  return request('POST', '/api/resource/getResList', params)
}

// 资源删除
export function deleteRes(params) {
  return request('POST', '/api/resource/delete', params, true)
}

export function resSave(params) {
  return request('POST', '/api/resource/resSave', params, true)
}
// 刷新
export function refreshRes() {
  return request('GET', '/api/resource/refreshRes', null, true)
}
