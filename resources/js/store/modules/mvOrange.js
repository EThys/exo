import axios from 'axios'
import { mvOrange,transactionDelete,transactionUpdate, } from '../../api.js'

// initial state
const state = {
    fc: [],
    usd: [],
    fcTotal: 0,
    usdTotal: 0
}
  
// getters
const getters = {}
  
// mutations
const mutations = {
    mvOrangesData: (state, data) => {
        const c = data.currency.toLowerCase()
        state[c] = data.data
    },
    setTotal: (state, data) => {
        const n = data.currency.toLowerCase() + 'Total'
        state[n] = data.total
    },
    clearState: (state) => {
        state.usd = []
        state.fc = []
        state.totalFc = 0
        state.totalUsd = 0
    }
}

// actions
const actions = {
    getMvOranges ({ commit, dispatch }, data) {
        return new Promise((resolve, reject) => {
            axios(mvOrange, {
                params: {
                    currency: data.currency.CurrencyID,
                    from: data.from,
                    to: data.to
                }
            })
                .then(resp => {
                    commit('setTotal', {
                        currency: data.currency.Currency,
                        total: resp.data.total,
                    })
                    commit('mvOrangesData', {
                        data: resp.data.data,
                        currency: data.currency.Currency
                    })
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    store ({state, rootState}, data) {
        if(!rootState.currencies.selected) return
        return new Promise((resolve) => {
            let newdata = {
                success: [],
                failed: [],
            }
            // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
            function delay(newMvOrange) {
                return axios.post(mvOrange, {
                        ...newMvOrange,
                        currency: rootState.currencies.selected.CurrencyID
                    })
            }
              
            async function delayedLog(item) {
                try {
                    let response = await delay(item)
                    newdata.success.push({
                        ...response,
                        fakeId: item.TransactionID
                    })
                }catch(err) {
                    newdata.failed.push({
                        ...err.response,
                        fakeId: item.TransactionID
                    })
                }
            }
    
            async function processArray(array) {
                // map array to promises
                const promises = array.map(delayedLog);
                // wait until all promises are resolved
                await Promise.all(promises);
                resolve(newdata)
            }
    
            processArray(data)
        })
    },
    update ({state}, data) {
        return new Promise((resolve) => {
            let updated = []
            // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
            function delay(updateMvOrange) {
                return axios.post(transactionUpdate + '/' + updateMvOrange.TransactionID, {
                        ...updateMvOrange
                    })
            }
              
            async function delayedLog(item) {
                try {
                    let response = await delay(item)
                    updated.push(response)
                }catch(err) {
                    updated.push(err.response)
                }
            }
    
            async function processArray(array) {
                // map array to promises
                const promises = array.map(delayedLog);
                // wait until all promises are resolved
                await Promise.all(promises);
                resolve(updated)
            }
    
            processArray(data)
        })
    },
    destroy ({state}, data) {
        return new Promise((resolve) => {
            let deleted = []
            // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
            function delay(deleteMvOrange) {
                console.log(deleteMvOrange)
                return axios.get(transactionDelete + '/' + deleteMvOrange.TransactionID)
            }
              
            async function delayedLog(item) {
                try {
                    let response = await delay(item)
                    deleted.push(response)
                }catch(err) {
                    deleted.push(err.response)
                }
            }
    
            async function processArray(array) {
                // map array to promises
                const promises = array.map(delayedLog);
                // wait until all promises are resolved
                await Promise.all(promises);
                resolve(deleted)
            }
    
            processArray(data)
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