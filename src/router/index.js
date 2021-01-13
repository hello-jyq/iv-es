import Vue from 'vue'
import Router from 'vue-router'
import Homeold from '@/views/Home.vue'
import Home from '@/views/index.vue'
import Login from '@/views/login'
import NotFound from '@/views/404'
// import store from '@/store/index'
// import {getToken, getUserInfo} from '@/utils/storage'

Vue.use(Router)

const createRouter = () => new Router({
  mode: 'history',
  base: '/iv-es/',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home,
      redirect: '/search/general_search',
      children: [
        // {
        //   path: '/search/general_search',
        //   name: '普通搜索',
        //   component: () => import('@/views/search/generalSearch')
        // },
        // {
        //   path: '/advanced_search',
        //   name: '高级搜索',
        //   component: () => import('@/views/search/advancedSearch')
        // },
        // {
        //   path: '/search_result',
        //   name: '搜索结果',
        //   component: () => import('@/views/search/searchResult')
        // },
        // {
        //   path: '/personal_tag',
        //   name: '个人标签管理',
        //   component: () => import('@/views/searchManagement/personalTag')
        // },
        // {
        //   path: '/search_history',
        //   name: '搜索履历管理',
        //   component: () => import('@/views/searchManagement/searchHistory')
        // },
        // {
        //   path: '/search_help',
        //   name: '搜索帮助',
        //   component: () => import('@/views/searchHelp/index')
        // },
        // {
        //   path: '/user_management',
        //   name: '用户管理',
        //   component: () => import('@/views/systemManagement/userManagement')
        // },
        // {
        //   path: '/role_management',
        //   name: '角色管理',
        //   component: () => import('@/views/systemManagement/roleManagement')
        // },
        // {
        //   path: '/access_management',
        //   name: '访问权限管理',
        //   component: () => import('@/views/systemManagement/accessManagement')
        // },
        // {
        //   path: '/search_history_management',
        //   name: '搜索履历',
        //   component: () => import('@/views/systemManagement/searchHistoryManagement')
        // },
        // {
        //   path: '/background_plan_config',
        //   name: '后台计划配置',
        //   component: () => import('@/views/systemManagement/backgroundPlanConfig')
        // },
        // {
        //   path: '/query_result_analysis',
        //   name: '查询结果分析',
        //   component: () => import('@/views/systemManagement/queryResultAnalysis')
        // }

      ]

    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

/**
* 加载动态菜单和路由
*/
export function addDynamicMenuAndRoutes(menus) {
  // 添加动态路由
  // 添加动态路由前，重置默认路由，防止登出后路由不清空
  resetRouter()
  const dynamicRoutes = addDynamicRoutes(menus)
  dynamicRoutes.push({
    path: '*',
    redirect: '/404'
  })
  // 动态路由添加到第一个路由的子路由中
  router.options.routes[0].children = dynamicRoutes
  router.addRoutes(router.options.routes)
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
export function addDynamicRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].resUrl && /\S/.test(menuList[i].resUrl)) {
      menuList[i].resUrl = menuList[i].resUrl.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].resUrl,
        component: null,
        name: menuList[i].resName,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].id
        }
      }
      try {
        // 根据菜单URL动态加载vue组件
        let filePath = menuList[i].resFile
        if (filePath && /\S/.test(filePath)) { filePath = filePath.replace(/^\//, '') }
        route['component'] = resolve => require([`@/${filePath}`], resolve)
      } catch (e) { // console.log(e)
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
    console.log('动态路由加载...')
    console.log(routes)
    console.log('动态路由加载完成.')
  }
  return routes
}
export default router
