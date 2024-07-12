// let url = 'http://localhost:8000/api/v1'
let url = '/api/v1'
let company = url + '/company'
let currency = url + '/currency'
let mvOrange = url + '/transactions'
let transactionDelete= url + '/transactionDelete'
let transactionUpdate= url + '/transactionUpdate'
let sms = url + '/sms'
let phone_types = url + '/phone_types'
let login = url + '/login'
let logout = url + '/logout'
let verifyCodeUrl = url + '/verifyCode'
let user = url + '/user'

export { 
    login, 
    logout,
    user,
    company,
    verifyCodeUrl,
    currency,
    mvOrange,
    transactionDelete,
    transactionUpdate,
    sms,
    phone_types
}