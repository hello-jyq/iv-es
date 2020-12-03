import { request } from '@/utils/request'
// demoApi/getSummaryList
export function getSummaryList(params) {
  return request('POST', '/demoApi/getSummaryList', params)
}
