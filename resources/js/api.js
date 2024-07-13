// let url = 'http://localhost:8000/api/v1'
let url = '/api/v1'
let company = url + '/company'
let currency = url + '/currency'
let mvOrange = url + '/transactions'
let phoneTypeDelete= url + '/phoneTypeDelete'
let phoneTypeUpdate= url + '/phoneTypeUpdate'
let userDelete= url + '/userDelete'
let userUpdate= url + '/userUpdate'
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
    phoneTypeDelete,
    phoneTypeUpdate,
    userDelete,
    userUpdate,
    sms,
    phone_types
}