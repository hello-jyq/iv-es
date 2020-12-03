import * as types from './mutation-type'
const mutations = {
  [types.SET_LOGIN_STATUS](state, loginStatus) {
    state.loginStatus = loginStatus
  },
  [types.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  },
  // 20200221 添加 用户多组织对应
  [types.SET_ORGLIST_INFO](state, userOrgList) {
    state.userOrgList = userOrgList
  },
  [types.SET_CSRF_TOKEN](state, csrfToken) {
    state.csrfToken = csrfToken
  },
  [types.CHANGE_COLLAPSE](state, status) {
    state.isCollapse = status
  },
  [types.SET_DICT](state, dictType) {
    const idx = state.dictList.findIndex(item => item.dictTypeId === dictType.dictTypeId)
    if (idx >= 0) {
      // 替换dictTypeEmpty
      state.dictList.splice(idx, 1, dictType)
    } else {
      state.dictList.push(dictType)
    }
  },
  [types.CLEAR_DICT](state) {
    state.dictList = []
  },
  [types.SET_SEARCH_INFO](state, { path, searchParam }) {
    state.searchParams.set(path, searchParam)
  }
}
export default mutations
