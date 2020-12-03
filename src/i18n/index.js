import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './lang'
import ElementLocale from 'element-ui/lib/locale'
import { setLang } from '@/utils/storage'
import { getLanguageType } from '@/utils/lang'
Vue.use(VueI18n)
const lang = getLanguageType()
setLang(lang)
const i18n = new VueI18n({
  locale: lang,
  messages
})
ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n
