import { asyncRouterMap, constantRouterMap,routerTmpMap } from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
  // console.log('hasPermission', permission, route)
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, menus) {
  const newRoute = []
  menus.forEach(function(menu){
    routerMap.forEach(function(router){
      if (router.path === menu.url){
        router.meta.add = menu.add
        router.meta.del = menu.del
        router.meta.update = menu.update
        router.meta.select = menu.select
        router.meta.descripte = menu.descripte
        if (menu.children&& menu.children.length){
          const r = filterAsyncRouter(routerMap,menu.children)
          router.children= r
          router.meta.children = r
        }
        newRoute.push(router)
      }
    })
  })
  return newRoute
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        routerTmpMap[0].children = accessedRouters
        console.log('routerTmpMap',routerTmpMap)
        commit('SET_ROUTERS', routerTmpMap)
        resolve()
      })
    }
  }
}

export default permission
