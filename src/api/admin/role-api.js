import { request } from '@/utils/request'
// 获取资源列表
export function getRoleList(params) {
  return request('POST', '/api/role/getRoleList', params)
}

export function getAllRole() {
  return request('GET', '/api/role/getAllRole')
}

export function editDetail(params) {
  return request('POST', '/api/role/editDetail/' + params)
}

export function getAllResourceList() {
  return request('POST', '/api/role/getAllResourceList')
}

export function roleSave(params) {
  return request('POST', '/api/role/roleSave', params, true)
}

export function deleteRole(params) {
  return request('POST', '/api/role/delete', params, true)
}

export function refreshRole() {
  return request('GET', '/api/role/refreshRole', null, true)
}
