import request from '@/utils/request'

const serviceApi = {
  GetServiceList: '/go-dog/controller/v1/get/service/list',
}

export function getServiceList (parameter) {
  console.log('参数', parameter)
  return request({
    url: serviceApi.GetServiceList,
    method: 'get',
    data: parameter
  })
}
