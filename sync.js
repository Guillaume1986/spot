// ============================================================
//  sync.js — Synchronisation entre appareils (Firebase Firestore)
//  Toute la famille partage une sauvegarde identifiée par un
//  « code famille » secret. Chaque appareil lit et écrit cette
//  sauvegarde ; les changements apparaissent partout en direct.
// ============================================================

const FAMILY_KEY = "spot-famille";
let syncDb = null, syncRef = null, syncLastSent = "", syncTimer = null;
let syncStatus = "off"; // off | nocode | connecting | on | error

function syncAvailable() { return typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_CONFIG && window.firebase; }
function familyCode() { try { return localStorage.getItem(FAMILY_KEY) || ""; } catch (e) { return ""; } }

function syncInit() {
  if (!syncAvailable()) { syncStatus = "off"; return; }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    syncDb = firebase.firestore();
    syncDb.enablePersistence({ synchronizeTabs: true }).catch(() => {});
  } catch (e) { console.warn("Firebase non disponible", e); syncStatus = "error"; return; }
  const code = familyCode();
  if (!code) { syncStatus = "nocode"; view.screen = "famille"; render(); return; }
  syncAttach(code);
}

// Le profil sélectionné (state.current) reste propre à chaque appareil
function stateForSync() { const s = Object.assign({}, state); delete s.current; return JSON.stringify(s); }

function syncAttach(code) {
  syncStatus = "connecting";
  syncRef = syncDb.collection("familles").doc(code);
  syncRef.onSnapshot((doc) => {
    if (!doc.exists) { syncSave(true); syncStatus = "on"; return; }
    syncStatus = "on";
    const remote = doc.data().etat;
    if (!remote || remote === syncLastSent) return;
    syncLastSent = remote;
    try {
      const incoming = JSON.parse(remote);
      incoming.current = state.current;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
      state = load();
      if (view.screen === "famille") view.screen = state.current ? "home" : "profiles";
      if (view.screen !== "exercise") render();
    } catch (e) { console.warn("Sauvegarde distante illisible", e); }
  }, (err) => { console.warn("Synchronisation : erreur", err); syncStatus = "error"; });
}

// Appelé par save() dans app.js
function syncSave(immediate = false) {
  if (!syncRef) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const json = stateForSync();
    if (json === syncLastSent) return;
    syncLastSent = json;
    syncRef.set({ etat: json, maj: Date.now() }).catch((e) => { console.warn("Synchronisation : échec de l'envoi", e); syncStatus = "error"; });
  }, immediate ? 0 : 600);
}

function syncSetFamily(code) {
  code = String(code || "").trim();
  if (code.length < 12) { alert("Choisis un code famille d'au moins 12 caractères (lettres et chiffres)."); return false; }
  try { localStorage.setItem(FAMILY_KEY, code); } catch (e) {}
  syncLastSent = "";
  if (syncDb) syncAttach(code);
  return true;
}
function syncForget() { try { localStorage.removeItem(FAMILY_KEY); } catch (e) {} location.reload(); }

function syncStatusLabel() {
  if (!syncAvailable()) return "Non configurée : colle ta configuration Firebase dans firebase-config.js.";
  return { nocode: "En attente du code famille.", connecting: "Connexion…", on: `Active · code famille : ${familyCode()}`, error: "Erreur de connexion (vérifie Internet et les règles Firestore)." }[syncStatus] || "";
}

// Écran « code famille »
function renderFamille() {
  return `${topbar(false)}<div class="parent" style="max-width:520px;margin:0 auto;text-align:center">
    ${spotSVG("think")}
    <h2>Code famille 🔐</h2>
    <p>Entre le code secret de la famille pour retrouver les devoirs de Charles et Clara sur cet appareil. Le même code doit être utilisé sur tous les appareils.</p>
    <form data-action="set-family"><input name="code" placeholder="ex. : bourgeois-spot-2026" autocomplete="off" data-autofocus style="text-align:center;font-size:1.2rem">
      <div class="actions"><button type="submit" class="big green">Connecter ✔</button></div></form>
    <p class="hint">Première fois ? Invente un code long et difficile à deviner, puis note-le. Tout appareil qui connaît ce code voit les devoirs.</p>
    <button class="ghost small" data-action="skip-family">Continuer sans synchronisation sur cet appareil</button></div>`;
}

// Installation (PWA)
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
