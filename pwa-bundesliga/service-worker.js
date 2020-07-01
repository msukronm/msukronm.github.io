let CACHE_NAME = "pwa-bundesliga";
const urlsToCache = [
  "./",
  "./manifest.json",
  "./nav.html",
  "./index.html",
  "./pages/beranda.html",
  "./pages/klasemen.html",
  "./pages/klub.html",
  "./js/api-football-data.js",
  "./js/init.js",
  "./js/init-components.js",
  "./js/jquery-2.1.1.min.js",
  "./js/materialize.js",
  "./js/register-sw.js",
  "./css/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "./css/material-icons.css",
  "./css/materialize.css",
  "./css/style.css",
  "./img/icon/android-chrome-192x192.png",
  "./img/icon/android-chrome-512x512.png",
  "./img/icon/apple-touch-icon.png",
  "./img/icon/favicon.ico",
  "./img/icon/favicon-16x16.png",
  "./img/icon/favicon-32x32.png",
];

// Menyimpan Aset ke Cache
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Menggunakan Aset dari Cache
self.addEventListener("fetch", function(event) {
  const url = 'https://api.football-data.org';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

// Menghapus Cache Lama
self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});