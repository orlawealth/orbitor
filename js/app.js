//check if service worker is supported
if('serviceWorker' in navigator){
    
    navigator.serviceWorker.register('sw.js')
    .then((reg) => console.log('service worker registeredorb', reg))
    .catch((reg) => console.log('service worker not registered', err))
}