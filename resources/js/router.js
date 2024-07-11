import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import Layout from './views/Layout'
import Users from './views/Users'
import MVOrange from './views/MVOrange'
import SMS from './views/SMS'
import PhoneTypes from './views/PhoneType'
import store from './store/index'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Layout,
            meta: { 
                requiresAuth: true
            },
            children: [
                {
                    path: '',
                    name: 'Home',
                    redirect: '/transactions/usd'
                },
                {
                    path: 'transactions/:currency',
                    name: 'Transactions',
                    component: MVOrange
                },
                {
                    path: 'sms',
                    name: 'SMS',
                    component: SMS,
                    meta: {
                        requiresSimpleAdmin: true
                    }
                },
                {
                    path: 'phone_types',
                    name: 'Phone Type',
                    component: PhoneTypes,
                    meta: {
                        requiresSimpleAdmin: true
                    }
                },
                {
                    path: 'users',
                    name: 'Users',
                    component: Users,
                    meta: { 
                        requiresSuperAdmin: true
                    },
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { 
                requiresGuest: true
            },
        },
        { path: "*", redirect: '/absences' }
    ],
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('AccessToken') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            store.dispatch('auth/checkTime')
                .then(outdated => {
                    if (outdated) {
                        store.dispatch('auth/logout')
                    } else {
                        localStorage.setItem('LoginTime', new Date())
                        next()
                    }
                })
        }
    }else {
        next() 
    }
    if(to.matched.some(record => record.meta.requiresGuest)) {
        if (localStorage.getItem('AccessToken') != null) {
            next({
                path: '/',
                // params: { nextUrl: to.fullPath }
            })
        } else {
          next()
        }
    }else {
        next() 
    }
    if(to.matched.some(record => record.meta.requiresSuperAdmin)) {
        if (!store.getters['auth/isSuperAdmin']) {
            next({
                path: '/',
            })
        } else {
          next()
        }
    }else {
        next() 
    }
    if(to.matched.some(record => record.meta.requiresSimpleAdmin)) {
        if (!store.getters['auth/isSimpleAdmin']) {
            next({
                path: '/',
            })
        } else {
          next()
        }
    }else {
        next() 
    }
})

export default router
