/* Service worker — cache-first so the prototype installs and works offline.
   Bump CACHE when assets change to force a refresh. */
const CACHE = 'nrkd-proto-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/theme.css',
  './lib/bootstrap.min.css',
  './lib/bootstrap.bundle.min.js',
  './lib/bootstrap-icons.min.css',
  './lib/fonts/bootstrap-icons.woff',
  './lib/fonts/bootstrap-icons.woff2',
  './images/crest-normal.gif',
  './images/crest-light.png',
  './images/crest-dark.png',
  './images/crest-gray-silver.png',
  './images/karate-character.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './js/data.js',
  './js/store.js',
  './js/ui.js',
  './js/router.js',
  './js/screens/login.js',
  './js/screens/home.js',
  './js/screens/members.js',
  './js/screens/memberDetail.js',
  './js/screens/memberForm.js',
  './js/screens/grading.js',
  './js/screens/payments.js',
  './js/screens/promotions.js',
  './js/screens/classSlots.js',
  './js/screens/sessionPlans.js',
  './js/screens/lessonPlans.js',
  './js/screens/courses.js',
  './js/screens/attendance.js',
  './js/screens/curriculum.js',
  './js/screens/export.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
