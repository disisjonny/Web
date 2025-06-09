self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('teacher-platform-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/login.html',
        '/dashboard.html',
        '/add-student.html',
        '/student-list.html',
        '/edit-student.html',
        '/reports.html',
        '/settings.html',
        '/css/styles.css',
        '/js/main.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
