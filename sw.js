const CACHE='madeira-2026-v3.1.3';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith((async()=>{
    try {
      const response=await fetch(event.request,{cache:'no-store'});
      if(response && response.ok){ const copy=response.clone(); const cache=await caches.open(CACHE); await cache.put(event.request,copy); }
      return response;
    } catch(e) {
      return (await caches.match(event.request)) || (await caches.match('./index.html'));
    }
  })());
});
