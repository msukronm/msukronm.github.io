importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox)
{
  console.log("Workbox berjalan.");
}

workbox.precaching.precacheAndRoute([
  {url: "./", revision: '3'},
  {url: "./manifest.json", revision: '3'},
  {url: "./index.js", revision: '3'},
  {url: "./nav.html", revision: '3'},
  {url: "./index.html", revision: '3'},
  {url: "./service-worker.js", revision: '3'},
  {url: "./pages/beranda.html", revision: '3'}
], {
  ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('./js/'),
  workbox.strategies.cacheFirst({
    cacheName: 'file-js'
  })
);

workbox.routing.registerRoute(
  new RegExp('./css/'),
  workbox.strategies.cacheFirst({
    cacheName: 'file-css'
  })
);

workbox.routing.registerRoute(
  new RegExp('./page/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api-football-data-org',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
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