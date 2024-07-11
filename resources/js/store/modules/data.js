// initial state
const state = {
  status: ''
}
  
// getters
const getters = {}
  
// mutations
const mutations = {
  reset: (state) => {
    state.datacount = COUNT
  },
  dataRequest: (state) => {
    state.status = 'loading'
  },
  dataSuccess: (state) => {
    state.status = 'success'
  },
  dataError: (state) => {
    state.status = 'error'
  }
}

// actions
const actions = {
  loadData ({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      commit('dataRequest')
      dispatch('companies/getCompanies', null, {root:true})
        .then((resp) => {
          return dispatch('currencies/getCurrencies', null, {root:true})
        })
        .then((resp) => {
          commit('dataSuccess')
          resolve(resp)
        })
        .catch(err => {
          commit('dataError')
          reject(err)
        })
    })
  },
  resetState ({ commit }) {
    commit('reset')
  }
}
  

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}