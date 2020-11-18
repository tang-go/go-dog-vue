import request from '@/utils/request'

const powerApi = {
  GetRoleList:'/api/go-dog/controller/v1/get/role/list',
  CreateRole:'/api/go-dog/controller/v1/create/role',
  GetApiList:'/api/go-dog/controller/v1/get/api/list',
  DelApi:'/api/go-dog/controller/v1/del/api',
  CreateMenu: '/api/go-dog/controller/v1/create/menu',
  GetMenu:'/api/go-dog/controller/v1/get/menu',
  DelMenu:'/api/go-dog/controller/v1/del/menu'
}

//getRoleList 获取角色列表
export function getRoleList (params) {
  return request({
    url: powerApi.GetRoleList,
    method: 'get',
    params: params
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
