import Vue from 'vue-native-core'
import Vuex from 'vuex'
import state from './state'
import * as fileUtil from '../utils/fileUtil'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions: {
    configVal ({commit}, {key, val}) {
      commit('SETCONFIG', {key, val})
    },
    setUser ({commit}, usr) {
      commit('SETUSER', usr)
    },
    exitUser ({commit}) {
      commit('EXITUSER')
    }
  },
  mutations: {
    SETCONFIG (state, {key, val}) {
      state[key] = val
    },
    SETUSER (state, usr) {
      state.currentUser = usr
      state.isLogin = true
      state.serverUrl = usr.serverUrl
      fileUtil.saveAsyncStorage('currentUser', usr)
    },
    EXITUSER (state) {
      state.currentUser = {}
      state.isLogin = false
      fileUtil.saveAsyncStorage('currentUser', state.currentUser)
    }
  }
})

export default store
