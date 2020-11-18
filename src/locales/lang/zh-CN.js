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

  'menu.power': '权限管理',
  'menu.power.menu': '菜单管理',
  'menu.power.api': 'API管理',
  'menu.power.role': '角色管理',

  'menu.service': '在线服务',
  'menu.service.rpc': '在线服务',

  'menu.docker': 'docker管理',
  'menu.service.build': '发布docker镜像',
  'menu.service.build.title.build': '发布服务',
  'menu.service.build.title.seelog': '执行日志',
  'menu.service.build.button.build': '编译发布服务',
  'menu.service.build.button.update': '刷新',
  'menu.service.build.button.seelog': '查看执行日志',
  'menu.service.build.table.id': 'ID',
  'menu.service.build.table.name': '名称',
  'menu.service.build.table.status': '执行状态',
  'menu.service.build.table.status.success': '执行完成',
  'menu.service.build.table.status.ing': '执行中',
  'menu.service.build.table.time': '时间',
  'menu.service.build.table.action': '操作',
  'menu.service.build.form.git': 'git地址',
  'menu.service.build.form.gitAccount':'git账号',
  'menu.service.build.form.gitPwd':'git密码',
  'menu.service.build.form.harbor': '镜像地址',
  'menu.service.build.form.name': '镜像名称',
  'menu.service.build.form.account': 'harbor账号',
  'menu.service.build.form.pwd': '密码',
  'menu.service.build.form.path': '需要编译的代码路径',
  'menu.service.build.form.version': '版本',
  'menu.service.build.form.button': '确定发布',

  'menu.service.docker': '通过docker启动服务',
  'menu.service.docker.title.build': '启动服务',
  'menu.service.docker.title.see': '详情',
  'menu.service.docker.button.build': '启动服务',
  'menu.service.docker.button.update': '刷新',
  'menu.service.docker.button.see': '详情',
  'menu.service.docker.button.run': '启动',
  'menu.service.docker.button.del': '删除',
  'menu.service.docker.button.close': '关闭',

  'menu.service.docker.table.dockerid':'ID',
  'menu.service.docker.table.name': '名称',
  'menu.service.docker.table.image': '镜像',
  'menu.service.docker.table.status': '状态',
  'menu.service.docker.table.status.run': '运行中',
  'menu.service.docker.table.status.close': '停止中',
  'menu.service.docker.table.time': '时间',
  'menu.service.docker.table.action': '操作',

  'menu.service.docker.form.images': '镜像地址',
  'menu.service.docker.form.account': 'harbor账号',
  'menu.service.docker.form.pwd': '密码',
  'menu.service.docker.form.name': '服务名称',
  'menu.service.docker.form.port': '映射端口',
  'menu.service.docker.form.port.button': '添加端口映射',
  'menu.service.docker.form.button': '启动',


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
