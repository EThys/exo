importScripts("/wb-assets/precache-manifest.6fe506eb7251031ed2e320405e27b9d0.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

// importScripts("/js/custom/idb.js")
// importScripts("/js/custom/utility.js")

if (workbox) {
    // make sure we grab from cache if no network
    workbox.routing.registerRoute(
        function({ url, event }) {
            return !url.pathname.match(/^\/api\//)
        },
        workbox.strategies.staleWhileRevalidate()
    );
    workbox.routing.registerRoute(
        new RegExp('.(?:js|css|ico)$'),
        workbox.strategies.networkFirst({
            cacheName: 'static'
        }),
    )
    workbox.routing.registerRoute(
        new RegExp('.(?:jpg|png|gif|svg)$'),
        workbox.strategies.cacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    purgeOnQuotaError: true,
                })
            ]
        })
    )

    // // by me
    // workbox.routing.registerRoute(
    //     function({ url, event }) {
    //         return url.pathname.match(/^\/api\//)
    //     },
    //     workbox.strategies.networkFirst({
    //         cacheName: 'api'
    //     })
    // );
    // API rouutes
    // workbox.routing.registerRoute(
    //     '/api/v1/absence',
    //     function(args) {
    //         return fetch(args.event.request)
    //             .then(function(res) {
    //                 let cloneRes = res.clone()
    //                 clearAllData('absences')
    //                     .then(function() {
    //                         return cloneRes.json()    
    //                     })
    //                     .then(data => {
    //                         data.data.forEach(absence => {
    //                             writeData('absences', absence)
    //                         })
    //                     })
    //                 return res
    //             })
    //     }
    // )
    
    self._precacheManifest = [].concat(self.__precacheManifest || []);
    workbox.precaching.suppressWarnings();
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
    
    // install new service worker when ok, then reload page.
    self.addEventListener('message', msg => {
        if (msg.data.action == 'skipWaiting') {
            // workbox.skipWaiting()
            // workbox.clientsClaim()
            self.skipWaiting()
        }
    })
} else {
    console.log('Workbox didn\'t load');
}

