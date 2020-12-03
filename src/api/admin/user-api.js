import { request } from '@/utils/request'
// 获取资源列表
export function getUserList(params) {
  return request('POST', '/api/org/listUsers', params)
}

