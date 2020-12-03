import en from './en'
import cn from './cn'
import ja from './ja'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import jaLocale from 'element-ui/lib/locale/lang/ja'
const messages = {
  en: {
    ...en,
    ...enLocale
  },
  cn: {
    ...cn,
    ...zhLocale
  },
  ja: {
    ...ja,
    ...jaLocale
  }
}
export default messages
