/* Lyneo ERP — service worker mínimo.
   Serve só para o navegador reconhecer o ERP como app instalável.
   NÃO guarda nada em cache: o index.html e todos os dados vêm sempre da rede,
   por isso nunca aparece uma versão antiga do ERP depois de uma atualização
   e os dados (Supabase) nunca ficam guardados no dispositivo. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try { for (const k of await caches.keys()) await caches.delete(k); } catch (_) {}
    await self.clients.claim();
  })());
});
const OFFLINE = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lyneo ERP</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0F172A;color:#fff;font-family:system-ui,Segoe UI,Roboto,sans-serif;text-align:center;padding:24px}h1{font-size:22px;margin:0 0 8px}p{margin:0 0 20px;color:rgba(255,255,255,.7);font-size:15px}button{background:#106B9E;color:#fff;border:0;border-radius:8px;padding:11px 22px;font-size:15px;font-weight:600;cursor:pointer}</style></head><body><div><h1>Pas de connexion</h1><p>Lyneo ERP a besoin d’internet pour fonctionner.<br>Sem ligação à internet — volte a tentar quando estiver online.</p><button onclick="location.reload()">Réessayer / Tentar de novo</button></div></body></html>';
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Só intercepta navegações (abrir/recarregar a página) para mostrar um aviso se não houver rede.
  // Tudo o resto (Supabase, scripts, PDFs) passa direto, sem passar por aqui.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => new Response(OFFLINE, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
  }
});
