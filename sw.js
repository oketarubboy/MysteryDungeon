const APP_VERSION="0.2.2";
const CACHE_NAME=`simple-mystery-dungeon-${APP_VERSION}`;
const APP_SHELL=["./","./index.html","./style.css?v=0.2.2","./app.js?v=0.2.2","./manifest.json","./icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith((async()=>{try{const fresh=await fetch(e.request);const c=await caches.open(CACHE_NAME);c.put(e.request,fresh.clone());return fresh}catch(err){const cached=await caches.match(e.request);if(cached)return cached;if(e.request.mode==="navigate")return caches.match("./index.html");throw err}})())});
