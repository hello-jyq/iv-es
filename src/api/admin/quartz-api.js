import { request } from '@/utils/request'

export function getSchedulers(param) {
  return request('POST', '/api/scheduler/getScheduler', param)
}
