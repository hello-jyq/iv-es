import { request, download } from '@/utils/request'

// 检索
export function getItems(params) {
  return request('POST', '/api/es/list', params)
}

export function advancedSearch(params) {
  return request('POST', '/api/es/search', params)
}

export function filterSearch(params) {
  return request('POST', '/api/es/filtersearch', params)
}

export function downloadFile(param) {
  return download('POST', '/api/es/download', param)
}

export function getTerms(params) {
  return request('GET', '/api/es/terms', params)
}
