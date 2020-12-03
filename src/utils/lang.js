export function getLanguageType(langStr) {
  let lang = ''
  if (!langStr) {
    lang = window.localStorage.getItem('lang')
    if (lang) {
      return lang
    }
    langStr = navigator.language || navigator.browserLanguage
  }
  langStr = langStr.toLowerCase()
  if (langStr.indexOf('zh') >= 0) {
    lang = 'cn'
    // // console.log('cn')
  } else if (langStr.indexOf('ja') >= 0) {
    // // console.log('ja')
    lang = 'ja'
  } else if (langStr.indexOf('en') >= 0) {
    // // console.log('en')
    lang = 'en'
  } else {
    // // console.log('其他')
    lang = 'cn'
  }
  return lang
}
