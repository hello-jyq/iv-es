import { request, download } from '@/utils/request'

// 检索
export function getItems(params) {
  return request('POST', '/api/es/list', params)
}

// 普通检索
export function normalSearch(params) {
  return request('POST', '/api/es/normalsearch', params)
}

// 普通检索
export function fileternormalsearch(params) {
  return request('POST', '/api/es/fileternormalsearch', params)
}

// 高级检索
export function advancedSearch(params) {
  return request('POST', '/api/es/search', params)
}

// 高级过滤检索
export function advancedFilterSearch(params) {
  return request('POST', '/api/es/filtersearch', params)
}

export function filterSearch(params) {
  return request('POST', '/api/es/filtersearch', params)
}

export function downloadFile(param) {
  return download('POST', '/api/es/download', param)
}

// 联想词  【ES-API-001】联想词API.xlsx
export function getTerms(params) {
  return request('GET', '/api/es/terms', params)
}

// 【ES-API-002】热词取得API.xlsx
export function getHotwords(params) {
  return request('GET', '/api/es/hotWords', params)
}
// 【ES-API-003】搜索履历列表取得API.xlsx
export function getKeywords(params) {
  return request('GET', '/api/log/keywords', params)
}

// 【ES-API-006】文件树访问角色取得API
export function getEsRoles(params) {
  return request('GET', '/api/folderauth/esroles', params)
}

// 【ES-API-007】文件访问权限树取得API
export function getFoldertree(params) {
  return request('POST', '/api/folderauth/foldertree', params)
}

