//console.log('service worker inside sw.js');

const cacheName = "app-att-shell-rsrs-v3";
const dynamicCacheName = "dynamic-att-cache-v3";

const assets = [
    '/',
    'index.html',
    'js/app.js',
    'plugins/bootstrap/css/bootstrap.min.css',
    'plugins/themify/css/themify-icons.css',
    'plugins/fontawesome/css/all.css',
    'plugins/magnific-popup/dist/magnific-popup.css',
    'plugins/modal-video/modal-video.css',
    'plugins/animate-css/animate.css',
    'plugins/slick-carousel/slick/slick.css',
    'plugins/slick-carousel/slick/slick-theme.css',
    'css/style.css',
    'plugins/jquery/jquery.js',
    'js/contact.js',
    'plugins/bootstrap/js/popper.js',
    'plugins/bootstrap/js/bootstrap.min.js',
    'plugins/magnific-popup/dist/jquery.magnific-popup.min.js',
    'plugins/slick-carousel/slick/slick.min.js',
    'plugins/counterup/jquery.waypoints.min.js',
    'plugins/counterup/jquery.counterup.min.js',
    'plugins/modal-video/modal-video.js',
    'js/script.js',
    'default.html',
    'service.html'
];




// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

//install service worker
self.addEventListener('install', evt =>{
   // console.log('service worker has been installed.');
    evt.waitUntil(
         caches.open(cacheName).then(cache =>{
             cache.addAll(assets);
         })
    );
   
 });

 // Activate service worker
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated.');
    evt.waitUntil(
        // Open the cache storage and get all cache keys
        caches.keys().then(keys => {
            // Iterate through each key
            return Promise.all(keys.map(key => {
                // If the key is not the current cacheName, delete it
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

//Fetch event
self.addEventListener('fetch', evt => {
    //  console.log(evt);
    // check if request is made by chrome extensions or web page
    // if request is made for web page url must contains http.
    if (!(evt.request.url.startsWith('http'))) return; // Skip requests not made with http protocol

    evt.respondWith(
        fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
                cache.put(evt.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 75);
                return fetchRes;
            });
        }).catch(() => {
            return caches.match(evt.request).then(cacheRes => {
                return cacheRes || caches.match('default.html'); // Fallback to default.html if not found in cache
            });
        })
    );
});

 // Update service worker on reload
 self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
