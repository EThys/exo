import axios from 'axios'
import { currency } from '../../api.js'

// initial state
const state = {
  currencies: [],
  selected: null,
}
  
// getters
const getters = {}
  
// mutations
const mutations = {
  currenciesData: (state, data) => {
    state.currencies = data.data
  },
  select: (state, currency) => {
    state.selected = currency
  },
  clearState: (state) => {
    state.currencies = []
    state.selected = null
  }
}

// actions
const actions = {
  getCurrencies ({ commit }) {
    return new Promise((resolve, reject) => {
      axios(currency)
        .then(resp => {
          console.log("currencies",resp.data)
          commit('currenciesData', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  selectCurrency ({commit}, currency) {
    commit('select', currency)
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