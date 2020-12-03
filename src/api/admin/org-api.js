import { request } from '@/utils/request'
// 获取资源列表
export function getOrgList(params) {
  return request('POST', '/api/org/listOrgs', params)
}

export function orgSave(params) {
  return request('POST', '/api/org/orgSave', params, true)
}

export function getAllOrgAndUserTree(params) {
  return request('POST', '/api/org/getAllOrgAndUserTree/' + params)
}

export function orgRemove(params) {
  return request('POST', '/api/org/orgRemove', params, true)
}

// 组织选择
export function getAllOrgTreeByYear(params) {
  return request('POST', '/api/org/getAllOrgTree/' + params)
}

// 组织选择
export function getAllOrgTree(params) {
  return request('POST', '/api/org/getAllOrgTree')
}

export function userSave(params) {
  return request('POST', '/api/org/userSave', params, true)
}

export function userRemove(params) {
  return request('POST', '/api/org/userRemove', params, true)
}

export function orgUserEdit(params) {
  return request('POST', '/api/org/orgUserEdit/' + params)
}

export function orgUserInfo(userId, year) {
  return request('POST', '/api/org/orgUserInfo/' + userId + '/' + year)
}
orgUserInfo

export function userMove(params) {
  return request('POST', '/api/org/userMove', params)
}

export function orgMove(params) {
  return request('POST', '/api/org/orgMove', params)
}

// 获取所有的组织年度
export function getAllOrgYear(params) {
  return request('POST', '/api/org/getAllOrgYears/' + params)
}

// 年度组织树激活
export function activeOrgYear(params) {
  return request('POST', '/api/org/orgactive/' + params)
}
