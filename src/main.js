import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fonts/iconfont.css'
// 引入重置样式表
import '@/assets/styles/elrest.css'
// 引入样式表
import '@/assets/styles/styles.css'
// import 'jquery'
// import 'jquery.nicescroll'

// import 'jquery-ui-dist/jquery-ui'
// import 'jquery-ui-dist/jquery-ui.css'

// import 'swiper/dist/css/swiper.css'

// import 'handsontable/dist/handsontable.full.css'
// import 'handsontable/dist/handsontable.full.js'
// 引入echarts
// import echarts from 'echarts'
// // 引入i18n
import i18n from './i18n'
// // 引入进度条样式库
// import 'nprogress/nprogress.css'
// // 引入重置样式表
// import '@/assets/css/reset.css'

// // 引入字体图标css (字体图标的使用：iconfont icon-**）
// import '@/assets/fonts/iconfont.css'
// // 引入公共样式表

// import '@/assets/css/common.scss'
// // element重置样式
// import '@/assets/css/eleReset.css'

// // 主题换色
// import '@/assets/css/theme.scss'

// import '@/assets/css/beforeCommon.scss'
// // 自适应css
// import '@/assets/css/media.css'

// 路由守卫与动态路由处理
// import './permission.js'
// import '@/utils/array.js'
// import '@/utils/direct.js'

Vue.use(ElementUI)
Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts

window.vmi8n = new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
