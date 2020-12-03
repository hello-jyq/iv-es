import * as types from './mutation-type.js'
import { login, loginInfo, logout, loginByToken } from '@/api/login.js'
import { saveLoginStatus, removeLoginStatus } from '@/utils/storage'
import { getDictEntriesByTypeId } from '@/api/base.js'
import { addDynamicMenuAndRoutes } from '@/router/index'
import { refreshDict } from '@/api/admin/dict-api'

export function clearUserInfo({ commit }) {
  commit(types.SET_USER_INFO, {})
  commit(types.SET_ORGLIST_INFO, [])
}

export async function loginAction({ commit, getters }, params) {
  const res = await login(params)
  return _login(commit, getters, res)
}

export async function loginByTokenAction({ commit, getters }, params) {
  const res = await loginByToken(params)
  return _login(commit, getters, res)
}

function _login(commit, getters, res) {
  if (res && res.success) {
    const { csrfToken, userInfo, userOrgList } = res.datas
    // 登陆状态为已登录
    commit(types.SET_LOGIN_STATUS, 'yes')
    commit(types.SET_CSRF_TOKEN, csrfToken)
    commit(types.SET_USER_INFO, userInfo)

    commit(types.SET_ORGLIST_INFO, userOrgList)
    saveLoginStatus('yes')

    const routes = getters.menuList.concat(userInfo.routeList)
    // 解析菜单，并添加动态菜单
    addDynamicMenuAndRoutes(routes)
    return res
  } else {
    return res
  }
}

export async function loginInfoAction({ commit, getters }) {
  const res = await loginInfo()
  if (res && res.success) {
    const { csrfToken, userInfo, userOrgList } = res.datas
    commit(types.SET_CSRF_TOKEN, csrfToken)
    commit(types.SET_USER_INFO, userInfo)
    commit(types.SET_ORGLIST_INFO, userOrgList) // 添加用户的组织信息

    const routes = getters.menuList.concat(userInfo.routeList)
    // 解析菜单，并添加动态菜单
    addDynamicMenuAndRoutes(routes)
    return res
  } else {
    return res
  }
}

export async function logoutAction({ commit }) {
  const res = await logout()
  if (res && res.success) {
    commit(types.SET_LOGIN_STATUS, 'no')
    commit(types.SET_CSRF_TOKEN, '')
    commit(types.SET_USER_INFO, {})
    commit(types.SET_ORGLIST_INFO, []) // 添加用户的组织信息
    removeLoginStatus()
    return res
  } else {
    return res
  }
}

export async function getDicts({ commit, state }, dictTypeId) {
  if (state.dictList.find(item => item.dictTypeId === dictTypeId)) {
    return
  }
  // store里没有数据时，先放一个空的，防止同时向后台请求
  const dictTypeEmpty = {
    dictTypeId,
    dicts: []
  }
  commit(types.SET_DICT, dictTypeEmpty)

  const params = { dictTypeId }
  const res = await getDictEntriesByTypeId(params)
  if (res && res.success) {
    const dictType = {
      dictTypeId,
      dicts: res.datas.dicts
    }
    commit(types.SET_DICT, dictType)
  }
}

export async function refreshDictAndClearStore({ commit }) {
  const res = await refreshDict()
  if (res && res.success) {
    commit(types.CLEAR_DICT)
  }
}

export function saveSearchParam({ commit }, { path, searchParam }) {
  commit(types.SET_SEARCH_INFO, { path, searchParam })
}
