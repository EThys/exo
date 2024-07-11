import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import users from './modules/users'
import phone_types from './modules/phone_types'
import companies from './modules/companies'
import currencies from './modules/currencies'
import mvOrange from './modules/mvOrange'
import data from './modules/data'
import sms from './modules/sms'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    users,
    companies,
    currencies,
    mvOrange,
    data,
    sms,
    phone_types
  },
  strict: debug
})
