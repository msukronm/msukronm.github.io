importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if(workbox)
{
  console.log("Workbox berjalan.");
}

workbox.precaching.precacheAndRoute([
  {url: "./", revision: '5'},
  {url: "./manifest.json", revision: '5'},
  {url: "./index.js", revision: '5'},
  {url: "./nav.html", revision: '5'},
  {url: "./index.html", revision: '5'},
  {url: "./service-worker.js", revision: '5'},
  {url: "./pages/beranda.html", revision: '5'},
  {url: "./pages/klasemen.html", revision: '5'},
  {url: "./pages/klub.html", revision: '5'},
  {url: "./pages/klub_favorit.html", revision: '5'},
  {url: "./pages/lihat_tim.html", revision: '5'},
  {url: "./js/api-football-data.js", revision: '5'},
  {url: "./js/db.js", revision: '5'},
  {url: "./js/idb.js", revision: '5'},
  {url: "./js/init.js", revision: '5'},
  {url: "./js/init-components.js", revision: '5'},
  {url: "./js/jquery-2.1.1.min.js", revision: '5'},
  {url: "./js/materialize.js", revision: '5'},
  {url: "./js/push-notification.js", revision: '5'},
  {url: "./js/register-sw.js", revision: '5'},
  {url: "./css/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2", revision: '5'},
  {url: "./css/material-icons.css", revision: '5'},
  {url: "./css/materialize.css", revision: '5'},
  {url: "./css/style.css", revision: '5'},
  {url: "./img/icon/android-chrome-192x192.png", revision: '5'},
  {url: "./img/icon/android-chrome-512x512.png", revision: '5'},
  {url: "./img/icon/apple-touch-icon.png", revision: '5'},
  {url: "./img/icon/favicon.ico", revision: '5'},
  {url: "./img/icon/favicon-16x16.png", revision: '5'},
  {url: "./img/icon/favicon-32x32.png", revision: '5'}
], {
  ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('./js/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'file-js'
  })
);

workbox.routing.registerRoute(
  new RegExp('./css/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'file-css'
  })
);

workbox.routing.registerRoute(
  new RegExp('./page/'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-football-data-org',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 30,
      }),
    ],
  })
);

let CACHE_NAME = 'pwa-bundesliga';
self.addEventListener('push', event => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }

  const title = CACHE_NAME.toUpperCase();
  const options = {
    body: body,
    icon: './img/icon/favicon-32x32.png',
    badge: './img/icon/favicon-16x16.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});