
const state = {
    default: '',
    printers: [],   
}

// getters
const getters = {}

// mutations
const mutations = {
    setPrinters: (state, data) => {
        state.printers = data
        state.default = data[0]
    },
    clearState: (state) => {
      state.default = ''
      state.printers = []
    }
}

const actions = {
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