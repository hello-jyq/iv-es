import { request } from '@/utils/request'
// /api/bud/getBud 获取预算申请数据
export function getDictInfo(params) {
  return request('POST', '/api/dict/getDictTypeList2', params)
}
// 根据字典ID删除字典
export function deleteDictById(params) {
  return request('POST', '/api/dict/delete', params, true)
}
// 编辑
export function editDict(params) {
  return request('POST', '/api/dict/dictTypeSave', params, true)
}
// 根据typeId获取对应字典列表
export function getEntryList(params) {
  return request('POST', '/api/dict/getEntryList', params)
}
