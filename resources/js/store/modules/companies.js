import axios from 'axios'
import { company } from '../../api.js'

// initial state
const state = {
    companies: [],
}
  
// getters
const getters = {}
  
// mutations
const mutations = {
    companiesData: (state, data) => {
      state.companies = data.data
    },
    clearState: (state) => {
      state.companies = []
    }
}

// actions
const actions = {
  getCompanies ({ commit }) {
    return new Promise((resolve, reject) => {
      axios(company)
        .then(resp => {
          console.log("company",resp.data)
          commit('companiesData', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  clearState ({ commit }) {
    commit('clearState')
  }
}
  

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}