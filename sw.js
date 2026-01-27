// ATUALIZADO PARA V13 - ULTRA FIX DE IMAGENS
const CACHE_NAME = 'painel-v13-ultra-fix';

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

// 1. Instalação (Força a atualização imediata)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v13 instalado com sucesso');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Ativação (Limpa os caches antigos v11, v12, etc)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
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

  // --- CORREÇÃO DEFINITIVA ---
  // Se for imagem externa (Firebase, Google, Weserv ou Corsproxy),
  // OBRIGA o navegador a buscar na internet.
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('google') || 
      url.hostname.includes('weserv') ||
      url.hostname.includes('corsproxy')) {
    
    // AQUI ESTAVA O ERRO ANTES. O jeito certo é esse:
    event.respondWith(fetch(req)); 
    return;
  }

  // Estratégia Padrão: Tenta Cache, se não tiver, vai pra Rede
  event.respondWith(
    caches.match(req).then((response) => response || fetch(req))
  );
});
