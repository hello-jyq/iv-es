import { request } from '@/utils/request'
// 获取文件
export function getFolderTree(params) {
  return request('POST', '/api/folderauth/foldertree', params)
}
// 获取文件
export function getFolderTreeDemo(params) {
  return request('POST', '/api/folderauth/foldertreeDemo', params)
}
// 获取ESRoleDate文件
export function getEsRoles(params) {
  return request('POST', '/api/folderauth/esroles', params)
}
// 保存
export function saveAuth(params) {
  return request('POST', '/api/folderauth/save', params)
}
export function saveAuthNodes(params) {
  return request('POST', '/api/folderauth/saveNodes', params) 
}
export function saveAuthKeys(params) {
  return request('POST', '/api/folderauth/saveauthkeys', params) 
}

export function getFolderTreeByParentId(params) {
  return request('POST', '/api/folderauth/folderlazytree', params)
}

