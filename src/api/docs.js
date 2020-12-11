import request from '@/utils/request'

const docsAPI = {
  DelDocs:'/api/go-dog/controller/v1/del/docs',
  CreateDocs:'/api/go-dog/controller/v1/create/docs',
  GetDocsList:'/api/go-dog/controller/v1/get/docs/list',
}

//delDocs 删除文档
export function delDocs (data) {
  return request({
    url: docsAPI.DelDocs,
    method: 'post',
    data: data
  })
}

//createDocs 删除文档
export function createDocs (params) {
  return request({
    url: docsAPI.CreateDocs,
    method: 'post',
    data: params
  })
}

//getDocsList 获取文档列表
export function getDocsList (params) {
  return request({
    url: docsAPI.GetDocsList,
    method: 'get',
    params: params
  })
}