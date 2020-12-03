import { setLang } from '@/utils/storage'
export const lang = {
  data() {
    return {
      langIcon: ''
    }
  },
  created() {
    const lang = window.localStorage.getItem('lang') || 'cn'
    this.langIcon = `icon-${lang}`
    setLang(lang)
  },
  methods: {
    changeLang() {
      const lang = window.localStorage.getItem('lang')
      // if (lang) {
      //   if (lang === 'cn') {
      //     lang = 'en'
      //   } else if (lang === 'en') {
      //     lang = 'ja'
      //   } else {
      //     lang = 'cn'
      //   }
      // } else {
      //   lang = 'cn'
      // }
      // this.langIcon = `icon-${lang}`
      // // console.log('aaa', lang)
      setLang(lang)
      this.$i18n.locale = lang
    }
  }
}
