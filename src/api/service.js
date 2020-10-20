import request from '@/utils/request'

const serviceApi = {
  GetServiceList: '/go-dog/controller/v1/get/service/list',
  GetApiList: '/go-dog/controller/v1/get/api/list'
}

export function getServiceList (parameter) {
  console.log('参数', parameter)
  return request({
    url: serviceApi.GetServiceList + '?code=1121',
    method: 'get',
    data: parameter
  })
}

export function getApiList (parameter) {
  return request({
    url: serviceApi.GetApiList,
    method: 'get',
    data: parameter
  })
}
