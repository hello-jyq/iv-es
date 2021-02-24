import { request } from '@/utils/request'

export function getSearchLogByPage(params) {
  return request('POST', '/api/log/list', params)
}

// 作废模板
export function deleteById(param) {
  return request('POST', '/api/log/delete/' + param)
}
