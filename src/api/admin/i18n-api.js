import { request, download } from '@/utils/request'

export function getI18nList(params) {
  return request('POST', '/api/i18n/getList', params)
}

export function deleteI18n(params) {
  return request('POST', '/api/i18n/delete', params, true)
}
// 保存
export function saveI18n(params) {
  return request('POST', '/api/i18n/save', params, true)
}
// 刷新
export function refreshI18n() {
  return request('GET', '/api/i18n/refresh', null, true)
}
// 导出
export function exportI18n(fileType, params) {
  return download('POST', `/api/i18n/DataExport/${fileType}`, params)
}
// 模板导出
export function downloadI18nTemplate() {
  return download('POST', '/api/i18n/download/template')
}

