self.addEventListener("install", (event) => {
  console.log("Service Worker installing.")
  // Bỏ qua bước chờ để kích hoạt ngay lập tức
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.")
  // Yêu cầu client kiểm soát ngay lập tức
  event.waitUntil(clients.claim())
})

// Bạn có thể thêm các chiến lược caching ở đây
// Ví dụ:
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
