import request from '@/utils/request'

const storageAPI = {
  GetGitList:'/api/go-dog/controller/v1/get/git/list',
  CreateGit:'/api/go-dog/controller/v1/create/git',
  DelGit:'/api/go-dog/controller/v1/del/git',
  GetImageList:'/api/go-dog/controller/v1/get/image/list',
  CreateImage:'/api/go-dog/controller/v1/create/image',
  DelImage:'/api/go-dog/controller/v1/del/image',
}


//createGit 创建git仓库
export function createGit (data) {
  return request({
    url: storageAPI.CreateGit,
    method: 'post',
    data: data
  })
}

//delGit 删除git
export function delGit (data) {
  return request({
    url: storageAPI.DelGit,
    method: 'post',
    data: data
  })
}

//getGitList 获取git仓库
export function getGitList (params) {
  return request({
    url: storageAPI.GetGitList,
    method: 'get',
    params: params
  })
}


//createImage 创建image仓库
export function createImage (data) {
  return request({
    url: storageAPI.CreateImage,
    method: 'post',
    data: data
  })
}

//delImage 删除image
export function delImage (data) {
  return request({
    url: storageAPI.DelImage,
    method: 'post',
    data: data
  })
}

//getImageList 获取image仓库
export function getImageList (params) {
  return request({
    url: storageAPI.GetImageList,
    method: 'get',
    params: params
  })
}
