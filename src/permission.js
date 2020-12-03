// 路由守卫以及动态路由处理
import router from '@/router/index'
import store from '@/store/index'

// import { Message } from 'element-ui'
router.beforeEach(async(to, from, next) => {
  // 如果是到登录页面的话，直接放行
  if (to.path === '/login' || to.path === '/retrievePassword') {
    next()
  } else {
    // 判断该用户是否已经登录
    if (store.state.loginStatus === 'yes') {
      // 该用户已经登入
      // 判断store当中是否存在userInfo,如果不存在，从服务器获取， 防止页面刷新后，store清空
      if (!(store.state.userInfo.nickName)) {
        try {
          await store.dispatch('loginInfoAction')
          next({ ...to })
        } catch (error) {
          next('/login')
        }
      } else {
        next()
      }
    } else {
      // 当从login页面跳转时
      if (from.path === '/login') {
        return false
      } else {
        // 该用户未登录，跳转到登入页面
        next('/login')
      }
    }
  }
  // // console.log(to)
  // // console.log(from)
  // next()
})
