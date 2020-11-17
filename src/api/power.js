import request from '@/utils/request'

const powerApi = {
  CreateMenu: '/api/go-dog/controller/v1/create/menu',
  GetMenu:'/api/go-dog/controller/v1/get/menu'
}

//createMenu 创建菜单
export function createMenu (data) {
  console.log('参数', data)
  return request({
    url: powerApi.CreateMenu,
    method: 'post',
    data: data
  })
}

//getMenu 获取菜单
export function getMenu (params) {
  console.log('参数', params)
  return request({
    url: powerApi.GetMenu,
    method: 'get',
    params: params
  })
}
