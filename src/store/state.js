import { loadLoginStatus } from '@/utils/storage'
const state = {
  loginStatus: loadLoginStatus(), // 登录状态
  userInfo: {},
  userOrgList: [],
  isCollapse: false,
  csrfToken: '',
  dictList: [],
  searchParams: new Map(),
  falg: false
}
export default state
