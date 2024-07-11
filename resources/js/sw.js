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
    self._precacheManifest = [].concat(self.__precacheManifest || []);
    workbox.precaching.suppressWarnings();
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
    self.addEventListener('message', msg => {
        if (msg.data.action == 'skipWaiting') {
            self.skipWaiting()
        }
    })
} else {
    console.log('Workbox didn\'t load');
}
