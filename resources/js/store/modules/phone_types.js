import axios from 'axios'
import { phone_types } from '../../api.js'

// initial state
const state = {
    phone_types: [],
}
  
// getters
const getters = {}
  
// mutations
const mutations = {
    phoneTypesData: (state, data) => {
        state.phone_types = data.data
    },
    clearState: (state) => {
      state.phone_types = []
    }
}

// actions
const actions = {
    getUsers ({ commit }) {

        return new Promise((resolve, reject) => {
        axios(phone_types)
            .then(resp => {
        console.log(resp)

                commit('phoneTypesData', resp.data)
                resolve(resp)
            })
            .catch(err => {
                reject(err)
            })
        })
    },
    store ({state}, data) {
        return new Promise((resolve) => {
            let newdata = {
                success: [],
                failed: [],
            }
            // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
            function delay(newUser) {
                return axios.post(phone_types, {
                        ...newUser
                    })
            }
              
            async function delayedLog(item) {
                try {
                    let response = await delay(item)
                    newdata.success.push({
                        ...response,
                        fakeId: item.PhoneTypeID
                    })
                }catch(err) {
                    newdata.failed.push({
                        ...err.response,
                        fakeId: item.PhoneTypeID
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
            function delay(updateUser) {
                return axios.put(phone_types + '/' + updateUser.PhoneTypeID, {
                        ...updateUser
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
            function delay(deleteUser) {
                // console.log(deleteUser)
                return axios.delete(phone_types + '/' + deleteUser.PhoneTypeID)
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