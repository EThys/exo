import Vue from 'vue'
import IdleVue from 'idle-vue'
import router from './router'
import store from './store/index'
import App from './views/App'
import axios from 'axios'
import Toasted from 'vue-toasted';
// import './registerSW'
import VDragged from 'v-dragged'
import VuejsDialog from 'vuejs-dialog';
// include the default style
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

// import '@progress/kendo-ui'
import '@fortawesome/fontawesome-free/js/all'

// import { GridPdfExport } from '@progress/kendo-vue-pdf';
import { Grid, GridToolbar  } from '@progress/kendo-vue-grid'
import Loading from './components/Loading'
import UssdConfig from './components/UssdConfig'
import UserDetails from './components/UserDetails'
import JsonExcel from 'vue-json-excel'

Vue.use(IdleVue, {
  store,
  idleTime: 1800000 // 30 min (30 * 60 * 1000)
})

Vue.use(Toasted)
Vue.use(VDragged) 
Vue.use(VuejsDialog);

Vue.component('Grid', Grid);
Vue.component('grid-toolbar', GridToolbar);
Vue.component('loading', Loading);
Vue.component('downloadExcel', JsonExcel)
Vue.component('ussd-config', UssdConfig);
Vue.component('user-details', UserDetails);

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
Vue.prototype.$http = axios;
const token = localStorage.getItem('AccessToken')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

// options to the toast
let my_app_error_options = {
  type	: 'error',
  iconPack: 'fontawesome',
  icon : 'exclamation-triangle',
  action: {
    text : 'Fermer',
    onClick : (e, toastObject) => {
      toastObject.goAway(0);
    }
  },
  duration: 15000,
  position: 'bottom-center'
};

// register the toast with the custom message
Vue.toasted.register('my_app_error',
  (payload) => {
  
      // if there is no message passed show default message
      if(!payload.message) {
        return "&nbsp; Erreur réseau, veuillez vérifier votre connexion internet!"
      }
  
      // if there is a message show it with the message
      return "&nbsp; Oops.. " + payload.message;
  },
  my_app_error_options
)

const app = new Vue({
    el: '#app',
    components: { App },
    router,
    store,
});

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
// }
