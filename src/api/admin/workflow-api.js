import { request } from '@/utils/request'
// 获取资源列表
export function getDefList(params) {
  return request('POST', '/api/workflow/admin/getDefList', params)
}

export function createProcessInst(params) {
  return request('POST', '/api/workflow/admin/createProcessInst', params)
}
// 流程实例列表
export function getInstList(params) {
  return request('POST', '/api/workflow/admin/getInstList', params)
}

export function getTaskList(id) {
  return request('POST', `/api/workflow/admin/getTaskList/${id}`)
}

export function getProcessInfo(taskId) {
  return request('POST', `/api/workflow/admin/processInstInfo/${taskId}`)
}

export function getVarsList(params) {
  return request('POST', '/api/workflow/admin/getVarsList/' + params)
}

export function getActivityList(params) {
  return request('POST', '/api/workflow/admin/activityList/' + params)
}
export function taskBack(params) {
  return request('POST', '/api/workflow/admin/taskBack', params)
}

export function taskFinish(params) {
  return request('POST', '/api/workflow/admin/taskFinish/' + params)
}

export function taskChange(params) {
  return request('POST', '/api/workflow/admin/taskChange', params)
}

export function saveVariables(params) {
  return request('POST', '/api/workflow/admin/saveVariables', params)
}

// 流程代理
export function getProxyList(params) {
  return request('POST', '/api/workflow/admin/getProxyList', params)
}

export function getFlowDef() {
  return request('POST', '/api/workflow/admin/getFlowDef')
}

export function getDefByAgentId(params) {
  return request('POST', '/api/workflow/admin/getDefByAgentId/' + params)
}

export function proxyAdd(params) {
  return request('POST', '/api/workflow/admin/proxyAdd', params)
}

export function proxySave(params) {
  return request('POST', '/api/workflow/admin/proxySave', params)
}
export function proxyDelete(params) {
  return request('POST', '/api/workflow/admin/delete', params)
}
