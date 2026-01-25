// ATUALIZADO PARA V9 - CORREÇÃO DE CACHE E NOVOS ARQUIVOS
const CACHE_NAME = 'painel-gestor-v9-fix';

const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './entrada.html', // ADICIONADO: A nova capa precisa ser salva
  './catalogo.html',
  './manifest.json',
  './logo.png',
  './firebase-config.js'
];

// 1. Instalação: Baixa os arquivos novos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a atualização imediata
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache v9 aberto e arquivos salvos');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Ativação: Limpa os caches antigos (v8, v7...)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Interceptação: Estratégia "Network First" para HTML (Evita travar se atualizar)
// Para imagens e CSS, usa Cache First. Para HTML, tenta a rede primeiro.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Se for arquivo HTML (admin, entrada, catalogo), tenta baixar da rede primeiro
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(req); // Se estiver offline, usa o cache
        })
    );
  } else {
    // Para imagens, JS, CSS, fontes: Cache primeiro, depois rede
    event.respondWith(
      caches.match(req).then((response) => {
        return response || fetch(req);
      })
    );
  }
});
