import request from '@/utils/request'

const serviceApi = {
  GetServiceList: '/go-dog/controller/v1/get/service/list',
  GetBuildServiceList: '/go-dog/controller/v1/get/build/service/list',
  BuildService: '/go-dog/controller/v1/build/service',
}

export function getServiceList (parameter) {
  console.log('参数', parameter)
  return request({
    url: serviceApi.GetServiceList,
    method: 'get',
    data: parameter
  })
}


export function getBuildServiceList (parameter) {
  return request({
    url: serviceApi.GetBuildServiceList,
    method: 'get',
    params: parameter
  })
}

export function buildService (parameter) {
  console.log('参数', parameter)
  return request({
    url: serviceApi.BuildService,
    method: 'post',
    data: parameter
  })
}
