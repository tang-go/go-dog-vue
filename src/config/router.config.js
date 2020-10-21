// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'menu.home',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'menu.index',
        meta: { title: 'menu.index', keepAlive: true, permission: ['index', 'admin'] },
        component: () => import('@/views/index/index')
      },
      // 权限
      {
        path: '/service',
        name: 'service',
        component: RouteView,
        meta: { title: 'menu.service', hideHeader: true, permission: ['admin'] },
        redirect: '/service/rpc/list',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/service/rpc/list',
            name: 'RpcList',
            component: () => import('@/views/service/RpcList'),
            meta: { title: 'menu.service.rpc', hidden: true, keepAlive: true, permission: ['admin'] }
          },
          // {
          //   path: '/service/api/list',
          //   name: 'ApiList',
          //   component: () => import('@/views/other/PermissionList'),
          //   meta: { title: 'menu.service.api', hidden: true, keepAlive: true, permission: ['admin'] }
          // }
        ]
      },
      // 权限
      {
        path: '/power',
        name: 'power',
        component: () => import('@/views/role/Index'),
        meta: { title: 'menu.power', hideHeader: true, permission: ['admin'] },
        redirect: '/power/role/list',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/power/role/list',
            name: 'RoleList',
            component: () => import('@/views/role/RoleList'),
            meta: { title: 'menu.power.role', hidden: true, keepAlive: true, permission: ['admin'] }
          },
          {
            path: '/power/permission/list',
            name: 'PermissionList',
            component: () => import('@/views/other/PermissionList'),
            meta: { title: 'menu.power.permission', hidden: true, keepAlive: true, permission: ['admin'] }
          }
        ]
      }
    ]
  },
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

  {
    path: '*', redirect: '/404', hidden: true
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
