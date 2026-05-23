const APP_VERSION="0.4.0";
const CACHE_NAME=`simple-mystery-dungeon-${APP_VERSION}`;
const APP_SHELL=["./","./index.html","./style.css?v=0.4.0","./app.js?v=0.4.0","./manifest.json","./icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;e.respondWith((async()=>{try{const fresh=await fetch(req);const cache=await caches.open(CACHE_NAME);cache.put(req,fresh.clone());return fresh}catch(err){const cached=await caches.match(req);if(cached)return cached;if(req.mode==="navigate")return caches.match("./index.html");throw err}})())});
