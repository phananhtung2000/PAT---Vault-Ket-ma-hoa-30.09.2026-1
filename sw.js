const CACHE_NAME = 'pat-vault-cache-v1'; // đổi v1 -> v2 khi cập nhật index.html để máy khách nhận bản mới

const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// Font ngoài (Google Fonts) - chỉ là tài nguyên tĩnh, cache để dùng offline
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
const STATIC_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      try {
        const res = await fetch(FONT_CSS, { mode: 'no-cors' });
        await cache.put(FONT_CSS, res);
      } catch (e) { /* offline lúc cài: bỏ qua, font sẽ được cache ở lần mở sau */ }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isStaticHost = STATIC_HOSTS.includes(url.hostname);

  // Chỉ xử lý tài nguyên tĩnh của app hoặc font; mọi request khác để trình duyệt tự xử lý
  if (!sameOrigin && !isStaticHost) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (isStaticHost && res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
    })
  );
});
