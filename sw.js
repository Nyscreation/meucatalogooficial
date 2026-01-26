// ATUALIZADO PARA V11 - CORREÇÃO DEFINITIVA DE IMAGEM
const CACHE_NAME = 'painel-gestor-v11-proxy';

const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './entrada.html',
  './catalogo.html',
  './manifest.json',
  './logo.png',
  './firebase-config.js'
];

// 1. Instalação
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v11 instalado');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Ativação (Limpeza antiga)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Interceptação Inteligente
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // --- REGRA DE OURO ---
  // Se for imagem do Firebase, Google ou do Proxy (weserv), IGNORA O CACHE.
  // Deixa passar direto para a internet. Isso resolve o erro de travamento.
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('google') || 
      url.hostname.includes('weserv')) {
    return; 
  }

  // Estratégia HTML (Network First)
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
  } else {
    // Estratégia Assets (Cache First)
    event.respondWith(
      caches.match(req).then((response) => response || fetch(req))
    );
  }
});
