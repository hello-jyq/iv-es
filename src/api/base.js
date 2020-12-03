import { request } from '@/utils/request'

export function getDictEntriesByTypeId(params) {
  return request('POST', '/api/base/getDictEntriesByTypeId', params)
}
export function getDictEntriesByParent(params) {
  return request('POST', '/api/base/getDictEntriesByParent', params)
}

export function getExecTask(taskId) {
  return request('GET', `/api/workflow/user/task/exec/${taskId}`)
}

export function getTasks(params) {
  return request('POST', '/api/workflow/user/tasks', params)
}

export function getTodoList(params) {
  return request('POST', '/api/home/todolist', params)
}

export function getMyTodoList(params) {
  return request('POST', '/api/home/todolist', params)
}

export function getMyTaskList(params) {
  return request('POST', '/api/home/task', params)
}

export function getMyRunningList(params) {
  return request('POST', '/api/home/running', params)
}

export function getRunnings(params) {
  return request('POST', '/api/workflow/user/runnings', params)
}

export function getFinished(params) {
  return request('POST', '/api/workflow/user/finished', params)
}

export function getProcessTrace(pid) {
  return request('GET', `/api/workflow/user/process/trace/${pid}`)
}

export function getProcessAllTrace(pid) {
  return request('GET', `/api/workflow/user/process/alltrace/${pid}`)
}

export function getBackActivity(params) {
  return request('GET', '/api/workflow/user/getBackActivity', params)
}

export function agreeTask(params) {
  return request('POST', '/api/workflow/user/agreeTask', params, true)
}

export function rejectTask(params) {
  return request('POST', '/api/workflow/user/rejectTask', params, true)
}

export function agreeTasks(params) {
  return request('POST', '/api/workflow/user/agreeTasks', params, true)
}

export function withdrawTask(params) {
  return request('POST', '/api/workflow/user/withdrawTask', params, true)
}
export function getHistoryList(identiferNum) {
  return request('GET', `/api/history/gethistory/${identiferNum}`)
}

export function getHomeBafInfo() {
  return request('GET', '/api/home/getHomeBafInfo')
}
