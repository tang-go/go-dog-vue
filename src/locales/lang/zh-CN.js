import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.index': '首页',

  'menu.service': '服务管理',
  'menu.service.rpc': '在线服务列表',
  'menu.service.build': '发布docker镜像',
  'menu.service.docker': 'docker启动镜像',

  'menu.power': '权限管理',
  'menu.power.role': '角色管理',
  'menu.power.permission': '权限管理',

  'menu.admin': '个人中心',
  'menu.admin.center': '个人中心',
  'menu.admin.logout': '退出',
  'menu.admin.set': '个人设置',
  'layouts.usermenu.dialog.title': '提示',
  'layouts.usermenu.dialog.content': '是否要退出登录'
}

export default {
  ...components,
  ...locale
}
