// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

// const RouteView = {
//   name: 'RouteView',
//   render: (h) => h('router-view')
// }
export const routerTmpMap = [
  {
    path: '/',
    name: 'menu.home',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/index',
    children: [],
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

export const asyncRouterMap = [
  {
    path: '/index',
    name: 'Index',
    meta: { title: 'menu.index',hidden: true, keepAlive: true },
    component: () => import('@/views/index/index')
  },
  //权限相关
  {
    path: '/power',
    name: 'Power',
    component: () => import('@/views/power/Index'),
    meta: { title: 'menu.power', hidden: true,keepAlive: true },
    hideChildrenInMenu: true,
  },
  {
    path: '/power/menu',
    name: 'PowerMenu',
    component: () => import('@/views/power/Menu'),
    meta: { title: 'menu.power.menu', hidden: true, keepAlive: true }
  },
  {
    path: '/power/api',
    name: 'PowerApi',
    component: () => import('@/views/power/Api'),
    meta: { title: 'menu.power.api', hidden: true, keepAlive: true }
  },
  {
    path: '/power/role',
    name: 'PowerRole',
    component: () => import('@/views/power/Role'),
    meta: { title: 'menu.power.role', hidden: true, keepAlive: true }
  },
  //系统相关
  {
    path: '/sys',
    name: 'Sys',
    component: () => import('@/views/sys/Index'),
    meta: { title: 'menu.sys', hidden: true,keepAlive: true },
    hideChildrenInMenu: true,
  },
  {
    path: '/sys/admin',
    name: 'SysAdmin',
    component: () => import('@/views/sys/Admin'),
    meta: { title: 'menu.sys.admin', hidden: true, keepAlive: true }
  },
  //服务相关
  {
    path: '/service',
    name: 'RpcList',
    meta: { title: 'menu.service', hidden: true,keepAlive: true },
    component: () => import('@/views/service/RpcList')
  },
  //仓库相关
  {
    path: '/storage',
    name: 'storage',
    component: () => import('@/views/storage/Index'),
    meta: { title: 'menu.storage', hidden: true,  keepAlive: true},
    hideChildrenInMenu: true,
  },
  {
    path: '/storage/git',
    name: 'StorageGit',
    component: () => import('@/views/storage/Git'),
    meta: { title: 'menu.storage.git', hidden: true, keepAlive: true}
  },
  {
    path: '/storage/image',
    name: 'StorageImage',
    component: () => import('@/views/storage/Image'),
    meta: { title: 'menu.storage.image', hidden: true, keepAlive: true}
  },
  //docker相关
  {
    path: '/docker',
    name: 'docker',
    component: () => import('@/views/docker/Index'),
    meta: { title: 'menu.docker', hidden: true,  keepAlive: true},
    hideChildrenInMenu: true,
  },
  {
    path: '/docker/build',
    name: 'BuildService',
    component: () => import('@/views/docker/BuildService'),
    meta: { title: 'menu.service.build', hidden: true, keepAlive: true}
  },
  {
    path: '/docker/start',
    name: 'StartDocker',
    component: () => import('@/views/docker/StartDocker'),
    meta: { title: 'menu.service.docker', hidden: true, keepAlive: true}
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/admin',
    component: UserLayout,
    redirect: '/admin/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/iterm',
    component: () => import('@/views/iterm/Iterm'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }

]
