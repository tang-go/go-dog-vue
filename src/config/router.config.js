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
  //权限
  {
    path: '/power',
    name: 'Power',
    component: () => import('@/views/power/Index'),
    meta: { title: 'menu.power', hidden: true,keepAlive: true },
    //redirect: '/power/menu',
    hideChildrenInMenu: true,
  },
  {
    path: '/power/menu',
    name: 'PowerMenu',
    component: () => import('@/views/power/Menu'),
    meta: { title: 'menu.power.menu', hidden: true, keepAlive: true }
  },
  {
    path: '/service',
    name: 'RpcList',
    meta: { title: 'menu.service', hidden: true,keepAlive: true },
    component: () => import('@/views/service/RpcList')
  },
  {
    path: '/docker',
    name: 'docker',
    component: () => import('@/views/docker/Index'),
    meta: { title: 'menu.docker', hidden: true,  keepAlive: true},
    redirect: '/docker/build',
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
  // {
  //   path: '/',
  //   name: 'menu.home',
  //   component: BasicLayout,
  //   meta: { title: 'menu.home' },
  //   redirect: '/index',
  //   children: [
  //     {
  //       path: '/index',
  //       name: 'index',
  //       meta: { title: 'menu.index', keepAlive: true, permission: ['index', 'admin'] },
  //       component: () => import('@/views/index/index')
  //     },
  //     {
  //       path: '/service',
  //       name: 'RpcList',
  //       meta: { title: 'menu.service', keepAlive: true, permission: ['admin'] },
  //       component: () => import('@/views/service/RpcList')
  //     },
  //     {
  //       path: '/docker',
  //       name: 'docker',
  //       component: () => import('@/views/docker/Index'),
  //       meta: { title: 'menu.docker', hideHeader: true, permission: ['admin'] },
  //       redirect: '/docker/build',
  //       hideChildrenInMenu: true,
  //       children: [
  //         {
  //           path: '/docker/build',
  //           name: 'BuildService',
  //           component: () => import('@/views/docker/BuildService'),
  //           meta: { title: 'menu.service.build', hidden: true, keepAlive: true, permission: ['admin'] }
  //         },
  //         {
  //           path: '/docker/start',
  //           name: 'StartDocker',
  //           component: () => import('@/views/docker/StartDocker'),
  //           meta: { title: 'menu.service.docker', hidden: true, keepAlive: true, permission: ['admin'] }
  //         }
  //       ]
  //     }
  //     // 权限
  //     // {
  //     //   path: '/power',
  //     //   name: 'power',
  //     //   component: () => import('@/views/role/Index'),
  //     //   meta: { title: 'menu.power', hideHeader: true, permission: ['admin'] },
  //     //   redirect: '/power/role/list',
  //     //   hideChildrenInMenu: true,
  //     //   children: [
  //     //     {
  //     //       path: '/power/role/list',
  //     //       name: 'RoleList',
  //     //       component: () => import('@/views/role/RoleList'),
  //     //       meta: { title: 'menu.power.role', hidden: true, keepAlive: true, permission: ['admin'] }
  //     //     },
  //     //     {
  //     //       path: '/power/permission/list',
  //     //       name: 'PermissionList',
  //     //       component: () => import('@/views/other/PermissionList'),
  //     //       meta: { title: 'menu.power.permission', hidden: true, keepAlive: true, permission: ['admin'] }
  //     //     }
  //     //   ]
  //     // }
  //   ]
  // },
  // account
  // {
  //   path: '/account',
  //   component: RouteView,
  //   redirect: '/account/center',
  //   name: 'menu.admin',
  //   meta: { title: 'menu.admin', keepAlive: true, permission: ['admin'] },
  //   children: [
  //     {
  //       path: '/account/center',
  //       name: 'menu.admin.center',
  //       component: () => import('@/views/account/center'),
  //       meta: { title: 'menu.admin', keepAlive: true, permission: ['admin'] }
  //     },
  //     {
  //       path: '/account/settings',
  //       name: 'menu.admin.set',
  //       component: () => import('@/views/account/settings/Index'),
  //       meta: { title: 'menu.admin.set', hideHeader: true, permission: ['admin'] },
  //       redirect: '/account/settings/base',
  //       hideChildrenInMenu: true,
  //       children: [
  //         {
  //           path: '/account/settings/base',
  //           name: 'BaseSettings',
  //           component: () => import('@/views/account/settings/BaseSetting'),
  //           meta: { title: '基本设置', hidden: true, permission: ['admin'] }
  //         },
  //         {
  //           path: '/account/settings/security',
  //           name: 'SecuritySettings',
  //           component: () => import('@/views/account/settings/Security'),
  //           meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['admin'] }
  //         },
  //         {
  //           path: '/account/settings/custom',
  //           name: 'CustomSettings',
  //           component: () => import('@/views/account/settings/Custom'),
  //           meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['admin'] }
  //         },
  //         {
  //           path: '/account/settings/binding',
  //           name: 'BindingSettings',
  //           component: () => import('@/views/account/settings/Binding'),
  //           meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['admin'] }
  //         },
  //         {
  //           path: '/account/settings/notification',
  //           name: 'NotificationSettings',
  //           component: () => import('@/views/account/settings/Notification'),
  //           meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['admin'] }
  //         }
  //       ]
  //     }
  //   ]
  // },
  
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
        component: () => import('@/views/admin/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }

]
