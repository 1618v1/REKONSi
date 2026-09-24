const V='rekonsi-v1',SHELL=['./','index.html','manifest.webmanifest','android-icon-192x192.png','apple-icon-152x152.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co'))return; // data selalu langsung ke Supabase
  if(r.mode==='navigate'){ // online: ambil versi terbaru; offline: pakai cache
    e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put('index.html',c));}return x;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(r).then(h=>{
    const f=fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c));}return x;}).catch(()=>h);
    return h||f;}));
});
