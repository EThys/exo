import axios from 'axios'
import { user,userDelete,userUpdate } from '../../api.js'

// initial state
const state = {
    users: [],
}
  
// getters
const getters = {}
  
// mutations
const mutations = {
    usersData: (state, data) => {
        state.users = data.data
    },
    clearState: (state) => {
      state.users = []
    }
}

// actions
const actions = {
    getUsers ({ commit }) {
        return new Promise((resolve, reject) => {
        axios(user)
            .then(resp => {
                commit('usersData', resp.data)
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
                return axios.post(user, {
                        ...newUser
                    })
            }
              
            async function delayedLog(item) {
                try {
                    let response = await delay(item)
                    newdata.success.push({
                        ...response,
                        fakeId: item.UserID
                    })
                }catch(err) {
                    newdata.failed.push({
                        ...err.response,
                        fakeId: item.UserID
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
                return axios.post(userUpdate + '/' + updateUser.UserID, {
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
                return axios.get(userDelete + '/' + deleteUser.UserID)
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