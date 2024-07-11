import { register } from 'register-service-worker'
import Vue from 'vue'

const motifyUserAboutUpdate = worker => {
    Vue.toasted.show('Nouveau contenu est disponible', {
        action : {
            text : 'Rafraîchir',
            onClick : () => {
                worker.postMessage({ action: "skipWaiting" });
            }
        }
    })
}

// if (process.env.NODE_ENV === 'production') {
if (false) {
  register(`/sw.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      motifyUserAboutUpdate(registration.waiting)
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}