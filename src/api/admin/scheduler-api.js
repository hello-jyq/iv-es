import { request } from '@/utils/request'
// 获取任务一览
export function getSchedulers(param) {
  return request('POST', '/api/scheduler/getScheduler', param)
}
// 删除
export function deleteScheduler(param) {
  return request('POST', '/api/scheduler/remove', param, true)
}
// 暂停
export function pauseScheduler(param) {
  return request('POST', '/api/scheduler/pause', param)
}
// 恢复
export function resumeScheduler(param) {
  return request('POST', '/api/scheduler/resume', param)
}
// 保存
export function saveScheduler(param) {
  return request('POST', '/api/scheduler/save', param, true)
}
// 手动执行
export function execScheduler(param) {
  return request('POST', '/api/scheduler/exec', param, true)
}
