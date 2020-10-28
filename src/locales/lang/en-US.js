import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {
  'message': '-',
  'menu.home': 'home',
  'menu.index': 'index',

  'menu.service': 'service manager',
  'menu.service.rpc': 'service list',

  'menu.service.build': 'build service',
  'menu.service.build.title.build': 'build service',
  'menu.service.build.title.seelog': 'run log',
  'menu.service.build.button.build': 'build service',
  'menu.service.build.button.seelog': 'see run log',
  'menu.service.build.table.id': 'id',
  'menu.service.build.table.name': 'name',
  'menu.service.build.table.status': 'run status',
  'menu.service.build.table.status.success': 'success',
  'menu.service.build.table.status.ing': 'ing',
  'menu.service.build.table.time': 'time',
  'menu.service.build.table.action': 'action',
  'menu.service.build.form.git': 'git address',
  'menu.service.build.form.harbor': 'harbor address',
  'menu.service.build.form.name': 'image name',
  'menu.service.build.form.path': 'path',
  'menu.service.build.form.version': 'version',
  'menu.service.build.form.button': 'ok',

  'menu.service.docker': 'build service',

  'menu.power': 'power',
  'menu.power.role': 'role',
  'menu.power.permission': 'permission',

  'menu.admin': 'center',
  'menu.admin.center': 'center',
  'menu.admin.logout': 'logout',
  'menu.admin.set': 'setting',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Do you really log-out.',

  'app.setting.pagestyle': 'Page style setting',
  'app.setting.pagestyle.light': 'Light style',
  'app.setting.pagestyle.dark': 'Dark style',
  'app.setting.pagestyle.realdark': 'RealDark style',
  'app.setting.themecolor': 'Theme Color',
  'app.setting.navigationmode': 'Navigation Mode',
  'app.setting.content-width': 'Content Width',
  'app.setting.fixedheader': 'Fixed Header',
  'app.setting.fixedsidebar': 'Fixed Sidebar',
  'app.setting.sidemenu': 'Side Menu Layout',
  'app.setting.topmenu': 'Top Menu Layout',
  'app.setting.content-width.fixed': 'Fixed',
  'app.setting.content-width.fluid': 'Fluid',
  'app.setting.othersettings': 'Other Settings',
  'app.setting.weakmode': 'Weak Mode',
  'app.setting.copy': 'Copy Setting',
  'app.setting.loading': 'Loading theme',
  'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
  'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify'
}

export default {
  ...components,
  ...locale
}
