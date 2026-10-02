/* Service worker de "Control de planta".
   - La app (index.html, manifest, íconos) se guarda para abrirla aunque no haya señal.
   - index.html se pide SIEMPRE primero a internet: cuando subís una versión nueva a GitHub, se actualiza sola.
   - three.js (la librería 3D) se guarda en el equipo, porque sin ella la planta no se dibuja.
   - Los datos de la Sheet (Apps Script) NUNCA se guardan acá: siempre van directo a internet.
   Solo hace falta cambiar VERSION si se modifica la lista ARCHIVOS. */
const VERSION = 'planta-v1';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' })));
    try { await cache.add(new Request(THREE_URL, { mode: 'no-cors' })); } catch (e) { /* se reintenta al primer uso */ }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;                       // las escrituras a la Sheet van directo a internet
  const url = new URL(req.url);

  if (url.href === THREE_URL) {                           // librería 3D: del equipo, y si falta se baja y se guarda
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const guardado = await cache.match(THREE_URL);
      if (guardado) return guardado;
      const res = await fetch(req);
      cache.put(THREE_URL, res.clone());
      return res;
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;        // todo lo demás (Apps Script, etc.): directo a internet

  event.respondWith((async () => {                        // archivos de la app: internet primero, equipo si no hay señal
    const cache = await caches.open(VERSION);
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (e) {
      const guardado = await cache.match(req, { ignoreSearch: true });
      if (guardado) return guardado;
      if (req.mode === 'navigate') return (await cache.match('./index.html')) || (await cache.match('./'));
      throw e;
    }
  })());
});
