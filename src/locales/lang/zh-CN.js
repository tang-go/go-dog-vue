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
  'menu.service.build.title.build': '发布服务',
  'menu.service.build.title.seelog': '执行日志',
  'menu.service.build.button.build': '编译发布服务',
  'menu.service.build.button.seelog': '查看执行日志',
  'menu.service.build.table.id': 'ID',
  'menu.service.build.table.name': '名称',
  'menu.service.build.table.status': '执行状态',
  'menu.service.build.table.status.success': '执行成功',
  'menu.service.build.table.status.ing': '执行中',
  'menu.service.build.table.time': '时间',
  'menu.service.build.table.action': '操作',
  'menu.service.build.form.git': 'git地址',
  'menu.service.build.form.harbor': '镜像地址',
  'menu.service.build.form.name': '镜像名称',
  'menu.service.build.form.path': '需要编译的代码路径',
  'menu.service.build.form.version': '版本',
  'menu.service.build.form.button': '确定发布',

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
