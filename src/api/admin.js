import request from '@/utils/request'

const adminApi = {
  GetAdminList:'/api/go-dog/controller/v1/get/admin/list',
  CreateAdmin:'/api/go-dog/controller/v1/create/admin',
  DelAdmin:'/api/go-dog/controller/v1/del/admin',
  DisableAdmin:'/api/go-dog/controller/v1/disable/admin',
  OpenAdmin:'/api/go-dog/controller/v1/open/admin'
}


//GetAdminList 获取管理员
export function getAdminList (params) {
    return request({
      url: adminApi.GetAdminList,
      method: 'get',
      params: params
    })
  }
  
//CreateAdmin 创建管理员
export function createAdmin (data) {
  return request({
    url: adminApi.CreateAdmin,
    method: 'post',
    data: data
  })
}

//DelAdmin 删除管理员
export function delAdmin (data) {
    return request({
      url: adminApi.DelAdmin,
      method: 'post',
      data: data
    })
  }

  //DisableAdmin 禁用管理员
export function disableAdmin (data) {
    return request({
      url: adminApi.DisableAdmin,
      method: 'post',
      data: data
    })
  }

  //OpenAdmin 开启管理员
export function openAdmin (data) {
    return request({
      url: adminApi.OpenAdmin,
      method: 'post',
      data: data
    })
  }