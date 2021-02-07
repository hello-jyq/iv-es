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

// 查询文件目录
export function getFilePath(params) {
  return request('GET', '/api/es/terms/filepath', params)
}

export function filterSearch(params) {
  return request('POST', '/api/es/filtersearch', params)
}

export function downloadFile(param) {
  return download('POST', '/api/es/download', param)
}

// 【ES-API-001】个人联想词取得API.xlsx
export function getTerms(params) {
  return request('GET', '/api/es/terms/list', params)
}

// 【ES-API-002】个人联想词清除API.xlsx
export function clearTerms(params) {
  return request('GET', '/api/es/terms/clear', params)
}
// 【ES-API-003】清除搜索履历API.xlsx
export function clearLogs(params) {
  return request('GET', '/api/log/clear', params)
}

// 【ES-API-006】文件树访问角色取得API
export function getEsRoles(params) {
  return request('GET', '/api/folderauth/esroles', params)
}

// 【ES-API-007】文件访问权限树取得API
export function getFoldertree(params) {
  return request('POST', '/api/folderauth/foldertree', params)
}

// 根据文档id查询文档信息
export function getDocById(param) {
  return request('GET', '/api/es/doc/' + param)
}
