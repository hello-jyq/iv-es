export const loginStatus = state => state.loginStatus
export const userInfo = state => state.userInfo
export const csrfToken = state => state.csrfToken
export const isCollapse = state => state.isCollapse
export const dictList = state => state.dictList
export const menuList = state => state.userInfo.menuList || []
export const searchParams = state => state.searchParams
// 20200221 add 多组织的时候，用来保存组织的信息。
export const userOrgList = state => state.userOrgList
