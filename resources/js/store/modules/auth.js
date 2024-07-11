import axios from 'axios'
import router from '../../router'
import { login, logout, verifyCodeUrl } from '../../api.js'
const THIRTY_MIN = 1800000 // 30 min (30 * 60 * 1000)

const state = {
    UserName: localStorage.getItem('UserName') || '',
    UserID: localStorage.getItem('UserID') || '',
    AccessToken: localStorage.getItem('AccessToken') || '',
    Admin: localStorage.getItem('Admin') || 0,
    status: '',
    Company: localStorage.getItem('Company') || '',
}

const getters = {
    isAuthenticated: state => !!state.AccessToken,
    authStatus: state => state.status,
    isSuperAdmin: state => state.Admin == 1,
    isSimpleAdmin: state => state.Admin == 2 || state.Admin == 1,
}

const mutations = {
    authRequest: (state) => {
        state.status = 'loading'
    },
    authSuccess: (state) => {
        state.status = 'success'
    },
    authData: (state, data) => {
        state.AccessToken = data.AccessToken
        state.UserID = data.UserID
        state.UserName = data.UserName
        state.Company = data.Company
        state.Admin = data.Admin
    },
    authError: (state) => {
        state.status = 'error'
    },
    logout: (state) => {
        state.status = ''
        state.AccessToken = ''
        state.UserID = ''
        state.UserName = ''
        state.Admin = 0
        state.Company = ''
    },
}

const actions = {
    login ({ commit }, user) {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit('authRequest')

        axios({url: login, data: user, method: 'POST' })
            .then(resp => {
                commit('authSuccess')
                resolve(resp)
            })
        .catch(err => {
          commit('authError', err)
          localStorage.removeItem('AccessToken') // if the request fails, remove any possible user token if possible
          localStorage.removeItem('UserID')
          localStorage.removeItem('UserName')
          localStorage.removeItem('Admin')
          localStorage.removeItem('LoginTime')
          localStorage.removeItem('Company')
          reject(err)
        })
      })
    },
    verifyCode ({commit}, data) {
        return new Promise((resolve, reject) => {
            commit('authRequest')
            axios({url: verifyCodeUrl, data: data, method: 'POST' })
                .then(resp => {
                    const AccessToken = resp.data.AccessToken
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' +AccessToken
                    const UserID = resp.data.UserID
                    const UserName = resp.data.UserName
                    const Admin = resp.data.Admin
                    const Company = resp.data.Company
                    localStorage.setItem('AccessToken', 'Bearer ' + AccessToken) // store the token in localstorage
                    localStorage.setItem('UserID', UserID)
                    localStorage.setItem('UserName', UserName)
                    localStorage.setItem('Admin', Admin)
                    localStorage.setItem('LoginTime', new Date())
                    localStorage.setItem('Company', Company)
                    commit('authData', resp.data)
                    commit('authSuccess')
                    resolve(resp)
                })
            .catch(err => {
              commit('authError', err)
              localStorage.removeItem('AccessToken') // if the request fails, remove any possible user token if possible
              localStorage.removeItem('UserID')
              localStorage.removeItem('UserName')
              localStorage.removeItem('Admin')
              localStorage.removeItem('LoginTime')
              localStorage.removeItem('Company')
              reject(err)
            })
          })
    },
    logout ({ commit, dispatch, rootState }) {
        commit('logout')
        axios.get(logout)
        localStorage.removeItem('AccessToken') // clear your user's token from localstorage
        localStorage.removeItem('UserID')
        localStorage.removeItem('UserName')
        localStorage.removeItem('Admin')
        localStorage.removeItem('LoginTime')
        localStorage.removeItem('Company')
        // remove the axios default header
        delete axios.defaults.headers.common['Authorization']
        // clear state data
        dispatch('companies/clearState', null, {root:true})
        dispatch('currencies/clearState', null, {root:true})
        dispatch('mvOrange/clearState', null, {root:true})
        dispatch('users/clearState', null, {root:true})
        router.push('/login')
    },
    checkTime () {
        return new Promise(resolve => {
            let loginDate = new Date(localStorage.getItem('LoginTime'))
            let now = new Date()
            let outdated = now - loginDate > THIRTY_MIN
            resolve(outdated)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}