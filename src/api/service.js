import request from '@/utils/request'

const serviceApi = {
  GetServiceList: '/go-dog/controller/v1/get/service/list',
  GetBuildServiceList: '/go-dog/controller/v1/get/build/service/list',
  BuildService: '/go-dog/controller/v1/build/service',
  GetDockerList: '/go-dog/controller/v1/get/docker/list',
  StartDocker: '/go-dog/controller/v1/strat/docker',
  CloseDocker: '/go-dog/controller/v1/clsoe/docker',
  DelDocker :'/go-dog/controller/v1/del/docker',
  RestartDocker :'/go-dog/controller/v1/restart/docker',
}

export function getServiceList (parameter) {
  console.log('参数', parameter)
  return request({
    url: serviceApi.GetServiceList,
    method: 'get',
    params: parameter
  })
}


export function getDockerList (parameter) {
  return request({
    url: serviceApi.GetDockerList,
    method: 'get',
    params: parameter
  })
}


export function delDocker (parameter) {
  return request({
    url: serviceApi.DelDocker,
    method: 'post',
    data: parameter
  })
}
export function restartDocker (parameter) {
  return request({
    url: serviceApi.RestartDocker,
    method: 'post',
    data: parameter
  })
}
export function closeDocker (parameter) {
  return request({
    url: serviceApi.CloseDocker,
    method: 'post',
    data: parameter
  })
}

export function startDocker (parameter) {
  return request({
    url: serviceApi.StartDocker,
    method: 'post',
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
