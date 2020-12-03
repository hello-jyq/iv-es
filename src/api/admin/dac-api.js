import { request, download } from '@/utils/request'
// 数据权限接口
// 查询一览
export function getDacList(params) {
  return request('POST', '/api/dac/getDacList', params)
}
// 删除
export function deleteDac(params) {
  return request('POST', '/api/dac/delete', params, true)
}
// 保存
export function saveDac(params) {
  return request('POST', '/api/dac/dacSave', params, true)
}
// 刷新缓存
export function refreshDac() {
  return request('GET', '/api/dac/refresh', null, true)
}
// 下载CSV
export function exportDac(fileType, params) {
  return download('POST', `/api/dac/DataExport/${fileType}`, params)
}
// 下载模板
export function downloadDacTemplate() {
  return download('POST', '/api/dac/download/template')
}
