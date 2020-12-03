import { request } from '@/utils/request'
// /api/auth/ajaxLogin 登录接口 我的测试
export function login(params) {
  return request('POST', '/api/auth/ajaxLogin', params)
}
export function loginInfo() {
  return request('GET', '/api/auth/loginInfo')
}
export function logout() {
  return request('GET', '/api/auth/logout')
}
export function changePassword(params) {
  return request('POST', '/api/auth/changePassword', params)
}
export function sendMail(userName) {
  return request('GET', `/api/auth/sendPasswordMail/${userName}`)
}
export function loginByToken(params) {
  return request('POST', '/api/auth/tokenLogin', params)
}

export function changeOrg(params) {
  return request('POST', '/api/auth/changeOrg', params)
}
