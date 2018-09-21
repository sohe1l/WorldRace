importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
    workbox.routing.registerRoute(
      new RegExp('.*'),
      workbox.strategies.networkFirst()
    );
}

