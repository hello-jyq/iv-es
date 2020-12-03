import { request } from '@/utils/request'
export function onlineUsers() {
  return request('GET', '/api/online/onlineUsers')
}
export function kickOut(params) {
  return request('POST', '/api/online/invalidate', params)
}

