import axios from 'axios'
import { sms } from '../../api.js'

// initial state
const state = {
    sms: []
};

// getters
const getters = {};

// mutations
const mutations = {
    load: (state, data) => {
        state.sms = data.reverse();
    }
};

// actions
const actions = {
    loadData({ commit }, { from, to }) {
        return new Promise((resolve, reject) => {
            window.readAllData("sms")
                .then(data => {
                    let texts = data.filter(text => {
                        let d = new Date(text.time).toISOString().split("T")[0]
                        return from <= d && d <= to
                    })
                    commit("load", texts);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    saveData({state}) {
        return new Promise((resolve, reject) => {
            let texts = []
            window.readAllData("sms")
                .then(data => {
                    texts = data
                    const items = data.filter(i => !i.database)
                    return axios.post(sms, items.reverse())
                })
                .then(resp => {
                    let lastDate = new Date() //
                    lastDate.setDate(lastDate.getDate()-7)
                    lastDate = lastDate.toISOString().split("T")[0]

                    texts.forEach(i => {
                        window.writeData('sms', {
                            ...i,
                            database: true
                        })

                        let d = new Date(i.time).toISOString().split("T")[0]
                        if(d < lastDate) {
                            window.deleteItemFromData('sms', i.id)
                        }
                    });
                    resolve(resp)
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
    // resetState ({ commit }) {
    //   commit('reset')
    //   reject()
    // }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
