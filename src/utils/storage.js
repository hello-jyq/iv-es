const LoginStatusKey = 'Login-Status' // 登录态 no yes 保存到SessionStorage
const PreUrlKey = 'Pre-Url' // 登录前Url 由于redirect后sessionId会变化保存到sessionStorage

// loginStatus增删改 sessionStorage
export function loadLoginStatus() {
  return sessionStorage.getItem(LoginStatusKey) || 'no'
}

export function saveLoginStatus(loginStatus) {
  sessionStorage.setItem(LoginStatusKey, loginStatus)
  return loginStatus
}

export function removeLoginStatus() {
  sessionStorage.removeItem(LoginStatusKey)
  return ''
}

// preUrl增删改
export function loadPreUrl() {
  return sessionStorage.getItem(PreUrlKey) || ''
}

export function savePreUrl(preUrl) {
  sessionStorage.setItem(PreUrlKey, preUrl)
  return preUrl
}

export function removePreUrl() {
  sessionStorage.removeItem(PreUrlKey)
  return ''
}

// 选中菜单
export function saveActiveMenu(index) {
  sessionStorage.setItem('activeMenu', index)
}
// 语言
export function setLang(lang) {
  localStorage.setItem('lang', lang)
}

