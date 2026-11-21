// Service worker : permet d'ouvrir Spot sans Internet une fois visité.
// Stratégie « réseau d'abord » : on prend la version en ligne si possible, sinon la copie en cache.
const CACHE = "spot-v7";
const SHELL = ["./", "./index.html", "./style.css", "./app.js", "./data.js", "./contenu.js", "./contenu-clara.js", "./firebase-config.js", "./sync.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Firestore et autres appels Google : jamais en cache
  if (url.hostname.includes("googleapis.com") && !url.hostname.includes("fonts")) return;
  // « no-cache » : le navigateur redemande toujours au serveur si le fichier a changé,
  // pour qu'une mise à jour envoyée sur GitHub apparaisse tout de suite
  const fresh = e.request.mode === "navigate"
    // Une page redirigée ne peut pas servir de réponse de navigation telle quelle : on la recopie
    ? fetch(e.request.url, { cache: "no-cache" }).then((r) => (r.redirected ? new Response(r.body, { status: r.status, statusText: r.statusText, headers: r.headers }) : r))
    : fetch(e.request, { cache: "no-cache" });
  e.respondWith(
    fresh.then((res) => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || (e.request.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
