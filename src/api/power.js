import request from '@/utils/request'

const powerApi = {
  DelRoleApi:'/api/go-dog/controller/v1/del/role/api',
  BindRoleApi:'/api/go-dog/controller/v1/bind/role/api',
  GetRoleApiList:'/api/go-dog/controller/v1/get/role/api/list',
  DelRoleMenu:'/api/go-dog/controller/v1/del/role/menu',
  BindRoleMenu:'/api/go-dog/controller/v1/bind/role/menu',
  GetRoleMenuList:'/api/go-dog/controller/v1/get/role/menu/list',
  GetRoleList:'/api/go-dog/controller/v1/get/role/list',
  DelRole:'/api/go-dog/controller/v1/del/role',
  CreateRole:'/api/go-dog/controller/v1/create/role',
  GetApiList:'/api/go-dog/controller/v1/get/api/list',
  DelApi:'/api/go-dog/controller/v1/del/api',
  CreateMenu: '/api/go-dog/controller/v1/create/menu',
  GetMenu:'/api/go-dog/controller/v1/get/menu',
  DelMenu:'/api/go-dog/controller/v1/del/menu'
}


//delRoleApi 删除角色API
export function delRoleApi (data) {
  return request({
    url: powerApi.DelRoleApi,
    method: 'post',
    data: data
  })
}

//bindRoleApi 绑定角色API
export function bindRoleApi (data) {
  return request({
    url: powerApi.BindRoleApi,
    method: 'post',
    data: data
  })
}

//getRoleApiList 获取角色Api列表
export function getRoleApiList (params) {
  return request({
    url: powerApi.GetRoleApiList,
    method: 'get',
    params: params
  })
}

//delRoleMenu 删除角色菜单
export function delRoleMenu (data) {
  return request({
    url: powerApi.DelRoleMenu,
    method: 'post',
    data: data
  })
}

//bindRoleMenu 绑定角色菜单
export function bindRoleMenu (data) {
  return request({
    url: powerApi.BindRoleMenu,
    method: 'post',
    data: data
  })
}


//getRoleMenuList 获取角色菜单列表
export function getRoleMenuList (params) {
  return request({
    url: powerApi.GetRoleMenuList,
    method: 'get',
    params: params
  })
}

//getRoleList 获取角色列表
export function getRoleList (params) {
  return request({
    url: powerApi.GetRoleList,
    method: 'get',
    params: params
  })
}

//delRole 删除角色
export function delRole (data) {
  return request({
    url: powerApi.DelRole,
    method: 'post',
    data: data
  })
}


//createRole 创建角色
export function createRole (data) {
  return request({
    url: powerApi.CreateRole,
    method: 'post',
    data: data
  })
}

//getApiList 获取API列表
export function getApiList (params) {
  return request({
    url: powerApi.GetApiList,
    method: 'get',
    params: params
  })
}

//delApi 删除API
export function delApi (params) {
  return request({
    url: powerApi.DelApi,
    method: 'post',
    data: params
  })
}


//createMenu 创建菜单
export function createMenu (data) {
  return request({
    url: powerApi.CreateMenu,
    method: 'post',
    data: data
  })
}

//getMenu 获取菜单
export function getMenu (params) {
  return request({
    url: powerApi.GetMenu,
    method: 'get',
    params: params
  })
}

//delMenu 删除菜单
export function delMenu (params) {
  return request({
    url: powerApi.DelMenu,
    method: 'post',
    data: params
  })
}
