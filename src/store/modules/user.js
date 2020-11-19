import storage from 'store'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { close } from '@/utils/websocket'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    menus: [],
    apis:[],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_APIS: (state,apis) => {
      state.apis = apis
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 10000) {
            const result = response.body
            storage.set(ACCESS_TOKEN, result.token, 60 * 60)
            commit('SET_TOKEN', result.token)
            resolve(response)
          }
          reject(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          console.log('请求用户信息返回', response)
          if (response.code === 10000) {
            const result = response.body
            if (result.menu && result.menu.length > 0) {
              commit('SET_MENUS', result.menu)
            }
            if (result.apis && result.apis.length > 0) {
              commit('SET_APIS', result.apis)
            }
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            resolve(response)
          }
          reject(response)
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_NAME', {})
          commit('SET_AVATAR', '')
          commit('SET_ROUTERS', [])
          commit('SET_APIS', [])
          commit('SET_MENUS', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
          close()
        // }).catch(() => {
        //   resolve()
        // }).finally(() => {
        // })
      })
    }

  }
}

export default user
