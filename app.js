// ============================================================
//  app.js — Logique de l'application Spot (profils Charles et Clara)
// ============================================================

const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const DAY_SHORT = { lundi: "Lun", mardi: "Mar", mercredi: "Mer", jeudi: "Jeu", vendredi: "Ven", samedi: "Sam", dimanche: "Dim" };
const STORAGE_KEY = "spot-devoirs-v3";
const OLD_STORAGE_KEY = "spot-devoirs-v2";
const POINTS_PER_LEVEL = 100;
const TYPE_LABELS = {
  lecture: "Lecture", son: "Cahier des sons", tempete: "Tempête de sons", etiquettes: "Mots-étiquettes",
  calligraphie: "Calligraphie", mots: "Mots à écrire", grille: "Grille de nombres", spatial: "Relations spatiales",
  tables: "Tables (+ − × ÷)", nombres: "Lecture des nombres", conjug: "Conjugaison",
  calcul: "Calcul", quiz: "Quiz", tache: "Tâche à cocher",
};
const TYPES_BY_GRADE = {
  1: ["lecture", "son", "tempete", "etiquettes", "calligraphie", "mots", "grille", "spatial", "calcul", "quiz", "tache"],
  3: ["lecture", "mots", "conjug", "tables", "nombres", "calcul", "quiz", "tache"],
};
const TYPE_EMOJI = { lecture: "📗", son: "🔊", tempete: "🌪️", etiquettes: "🏷️", calligraphie: "✍️", mots: "✏️", grille: "🔢", spatial: "🧭", tables: "✖️", nombres: "🔢", conjug: "🔤", calcul: "➕", quiz: "🧠", tache: "🎒" };
const CALC_MODES = {
  "+": "Addition (a + b)", "-": "Soustraction (a − b)", plus1: "1 de plus / 1 de moins", plus2: "2 de plus / 2 de moins",
  plus10: "10 de plus / 10 de moins", doubles: "Les doubles (a + a)", manquant: "Terme manquant (a + ? = c)",
  comparer: "Comparer (<, >, =)", x: "Multiplication (a × b)", "grands+": "Addition de grands nombres", "grands-": "Soustraction de grands nombres",
};
const LETTER_FONTS = 6;

// ------------------------------------------------------------
//  État et sauvegarde
// ------------------------------------------------------------
function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }
function uid() { return "t" + Math.random().toString(36).slice(2, 9); }

function defaultState() { return { pin: PARENT_PIN, current: null, profiles: DEFAULT_PROFILES() }; }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const d = defaultState();
      s.pin = s.pin || d.pin;
      s.profiles = s.profiles || {};
      for (const id in d.profiles) {
        if (!s.profiles[id]) s.profiles[id] = d.profiles[id];
        else {
          const p = s.profiles[id], dp = d.profiles[id];
          p.settings = Object.assign(deepCopy(BASE_SETTINGS), p.settings || {});
          p.spot = Object.assign({}, dp.spot, p.spot || {});
          p.progress = Object.assign({ points: 0, completed: {}, weekStart: null, history: [] }, p.progress || {});
          p.plan = p.plan || dp.plan; p.library = p.library || dp.library;
          p.grade = p.grade || dp.grade; p.gradeLabel = p.gradeLabel || dp.gradeLabel; p.name = p.name || dp.name;
          p.gender = p.gender || dp.gender;
          // Nouveau plan d'étude livré dans data.js : il remplace la semaine type (les points restent)
          if (dp.planEdition && p.planEdition !== dp.planEdition) {
            p.plan = dp.plan; p.planEdition = dp.planEdition; p.progress.completed = {};
            for (const t of dp.library) if (!p.library.some((x) => x.title === t.title)) p.library.push(t);
          }
        }
      }
      return s;
    }
    // Migration : ancienne sauvegarde (un seul enfant) → profil Charles
    const old = localStorage.getItem(OLD_STORAGE_KEY);
    const d = defaultState();
    if (old) {
      const o = JSON.parse(old);
      const c = d.profiles.charles;
      if (o.settings) { c.settings = Object.assign(deepCopy(BASE_SETTINGS), o.settings); if (o.settings.pin) d.pin = o.settings.pin; delete c.settings.pin; delete c.settings.childName; }
      if (o.plan) c.plan = o.plan;
      if (o.library) c.library = o.library;
      if (o.progress) c.progress = o.progress;
    }
    return d;
  } catch (e) {
    console.warn("Sauvegarde illisible, retour aux valeurs par défaut", e);
    return defaultState();
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (typeof syncSave === "function") syncSave();
}
function mondayOf(date) {
  const d = new Date(date); const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day); d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function todayKey() { return DAYS[(new Date().getDay() + 6) % 7]; }

let state = load();
(function weeklyReset() {
  const m = mondayOf(new Date());
  for (const id in state.profiles) {
    const p = state.profiles[id];
    if (p.progress.weekStart !== m) { p.progress.weekStart = m; p.progress.completed = {}; }
  }
  save();
})();

// Profil courant
function P() { return state.profiles[state.current] || null; }
function S() { return P().settings; }

let view = { screen: state.current ? "home" : "profiles", day: todayKey(), task: null, parentTab: "semaine", pin: "", edit: null, parentProfile: null };
let ex = null;

// ------------------------------------------------------------
//  Utilitaires
// ------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rnd(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
function normalize(s) { return String(s).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[’']/g, "'").replace(/\s+/g, " "); }
function normalizeStrict(s) { return String(s).trim().toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " "); }
function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
// Accord selon le profil : G("prêt", "prête")
function G(m, f, p = P()) { return p && p.gender === "f" ? f : m; }
function line(key, vars = {}) {
  let t = pick(SPOT_LINES[key]);
  const all = Object.assign({ name: P() ? P().name : "" }, vars);
  for (const k in all) t = t.replaceAll("{" + k + "}", all[k]);
  return t.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => G(m, f));
}
function levelOf(points) { return Math.floor(points / POINTS_PER_LEVEL) + 1; }
function sonByKey(k) { return SONS.find((s) => s.key === k) || SONS[0]; }
function calliByLetter(l) { return CALLI.find((c) => c.l === l) || CALLI[0]; }
function listeByKey(k) { return C3_LISTES.find((l) => l.key === k) || null; }
function repere(s) { return TEMPETE_REPERES[s] || ""; }
function distractors(pool, target, n) {
  const out = [];
  const p = shuffle(pool.filter((x) => normalize(x) !== normalize(target)));
  for (const x of p) { if (out.length >= n) break; if (!out.some((o) => normalize(o) === normalize(x))) out.push(x); }
  return out;
}

// ------------------------------------------------------------
//  Voix de Spot
// ------------------------------------------------------------
function frenchVoices() {
  if (!("speechSynthesis" in window)) return [];
  return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("fr"));
}
function pickVoice(name) {
  const voices = frenchVoices();
  if (name) { const v = voices.find((v) => v.name === name); if (v) return v; }
  const score = (v) => (/natural|online/i.test(v.name) ? 4 : 0) + (v.lang === "fr-CA" ? 2 : 0) + (/caroline|sylvie|nathalie|female/i.test(v.name) ? 1 : 0);
  return voices.slice().sort((a, b) => score(b) - score(a))[0] || null;
}
function say(text, force = false, opts = {}) {
  const s = Object.assign({}, P() ? S() : BASE_SETTINGS, opts);
  if ((!s.voice && !force) || !("speechSynthesis" in window) || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-CA";
    const v = pickVoice(s.voiceName);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = Number(s.rate) || 1; u.pitch = Number(s.pitch) || 1;
    const delay = !force && s.bips ? robotBips(opts.bipKind || "hello") : 0;
    setTimeout(() => speechSynthesis.speak(u), delay);
  } catch (e) { /* silencieux */ }
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { if (view.screen === "parent" && view.parentTab === "reglages") render(); };
function saySound(s) { const r = repere(s); say(r ? `${s}. Comme dans ${r}.` : s, true); }
let audioCtx = null;
function robotBips(kind = "hello") {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const notes = kind === "win" ? [[660, 0, .09], [880, .1, .09], [1100, .2, .18]] : [[880, 0, .07], [1180, .09, .07]];
    for (const [f, t, d] of notes) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "square"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + t + d);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + d + 0.02);
    }
    return kind === "win" ? 420 : 220;
  } catch (e) { return 0; }
}

// ------------------------------------------------------------
//  Dessin de Spot (SVG) — selon le profil, l'humeur et le niveau
// ------------------------------------------------------------
function spotSVG(mood = "happy", extraClass = "", profile = null) {
  const p = profile || P() || { spot: { body: "#5b8def", lunettes: "" }, progress: { points: 0 } };
  const level = levelOf(p.progress.points);
  const has = (id) => SPOT_UNLOCKS.some((u) => u.id === id && u.level <= level);
  const body = p.spot.body || "#5b8def", dark = shade(body, -0.3), light = "#dce8ff", screen = "#1c2540";
  let eyes, mouth;
  if (mood === "think") {
    eyes = `<circle cx="78" cy="78" r="7" fill="#7cf1ff"/><circle cx="110" cy="78" r="7" fill="#7cf1ff"/>`;
    mouth = `<path d="M82 100 q12 7 24 0" stroke="#7cf1ff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  } else if (mood === "party") {
    eyes = `<path d="M70 80 l8 -8 l8 8" stroke="#7cf1ff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M102 80 l8 -8 l8 8" stroke="#7cf1ff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    mouth = `<path d="M76 96 q18 18 36 0" stroke="#7cf1ff" stroke-width="5" fill="#7cf1ff" opacity=".9"/>`;
  } else if (mood === "sad") {
    eyes = `<circle cx="78" cy="78" r="8" fill="#7cf1ff"/><circle cx="110" cy="78" r="8" fill="#7cf1ff"/>`;
    mouth = `<path d="M80 104 q14 -10 28 0" stroke="#7cf1ff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  } else {
    eyes = `<circle cx="78" cy="78" r="9" fill="#7cf1ff"/><circle cx="110" cy="78" r="9" fill="#7cf1ff"/><circle cx="81" cy="75" r="3" fill="#fff"/><circle cx="113" cy="75" r="3" fill="#fff"/>`;
    mouth = `<path d="M78 98 q16 14 32 0" stroke="#7cf1ff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  const antenne = has("antenne")
    ? `<line x1="94" y1="40" x2="94" y2="14" stroke="${dark}" stroke-width="5"/><circle cx="94" cy="12" r="8" fill="#f59e0b"><animate attributeName="r" values="7;9;7" dur="1s" repeatCount="indefinite"/></circle>`
    : `<line x1="94" y1="40" x2="94" y2="24" stroke="${dark}" stroke-width="4"/><circle cx="94" cy="22" r="5" fill="#f59e0b"/>`;
  const casquette = has("casquette") ? `<path d="M56 46 q38 -26 76 0 l0 6 l-76 0 z" fill="#ef4444"/><rect x="118" y="44" width="28" height="8" rx="4" fill="#ef4444"/>` : "";
  // Lunettes du profil (ex. : mauves pour Clara) : montures colorées, verres transparents
  const lun = p.spot.lunettes;
  const lunettes = lun ? `<g fill="none" stroke="${lun}" stroke-width="4"><rect x="63" y="67" width="30" height="22" rx="9" fill="${lun}" fill-opacity=".15"/><rect x="95" y="67" width="30" height="22" rx="9" fill="${lun}" fill-opacity=".15"/><line x1="93" y1="76" x2="95" y2="76"/><line x1="48" y1="74" x2="63" y2="76"/><line x1="125" y1="76" x2="140" y2="74"/></g>` : "";
  const soleil = has("soleil") && !lun ? `<rect x="64" y="68" width="28" height="18" rx="6" fill="#111" opacity=".85"/><rect x="96" y="68" width="28" height="18" rx="6" fill="#111" opacity=".85"/><line x1="92" y1="76" x2="96" y2="76" stroke="#111" stroke-width="3"/>` : "";
  const cape = has("cape") ? `<path d="M52 118 l-22 60 l34 -12 z" fill="#8b5cf6"/><path d="M136 118 l22 60 l-34 -12 z" fill="#8b5cf6"/>` : "";
  const fusee = has("fusee") ? `<rect x="48" y="150" width="14" height="22" rx="5" fill="#9ca3af"/><rect x="126" y="150" width="14" height="22" rx="5" fill="#9ca3af"/><path d="M50 172 l5 12 l5 -12 z" fill="#f97316"/><path d="M128 172 l5 12 l5 -12 z" fill="#f97316"/>` : "";
  const couronne = has("couronne") ? `<path d="M64 42 l10 -16 l10 12 l10 -16 l10 16 l10 -12 l10 16 z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>` : "";
  return `<svg class="spot-svg ${extraClass}" viewBox="0 0 188 190" xmlns="http://www.w3.org/2000/svg" aria-label="Spot le robot">
    ${cape}${antenne}
    <rect x="48" y="40" width="92" height="84" rx="22" fill="${body}"/>
    <rect x="58" y="54" width="72" height="60" rx="14" fill="${screen}"/>
    <g class="spot-eyes">${eyes}</g>${mouth}${soleil}${lunettes}${casquette}${couronne}
    <rect x="34" y="70" width="14" height="26" rx="6" fill="${dark}"/><rect x="140" y="70" width="14" height="26" rx="6" fill="${dark}"/>
    <rect x="82" y="124" width="24" height="10" fill="${dark}"/>
    <rect x="56" y="132" width="76" height="40" rx="14" fill="${body}"/>
    <circle cx="94" cy="152" r="9" fill="${light}"/><circle cx="94" cy="152" r="4" fill="${mood === "party" ? "#22c55e" : "#f59e0b"}"/>
    ${fusee}
    <rect x="64" y="170" width="18" height="14" rx="6" fill="${dark}"/><rect x="106" y="170" width="18" height="14" rx="6" fill="${dark}"/>
  </svg>`;
}
function shade(hex, amt) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) return "#2f5bbf";
  const n = parseInt(m[1], 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c * amt : (255 - c) * amt))));
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((c) => c.toString(16).padStart(2, "0")).join("");
}

function confetti(n = 80) {
  const box = $("#confetti");
  const colors = ["#f59e0b", "#3b82f6", "#22c55e", "#ec4899", "#8b5cf6", "#ef4444"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw"; p.style.background = pick(colors);
    p.style.animationDuration = 2 + Math.random() * 2 + "s"; p.style.animationDelay = Math.random() * 0.8 + "s";
    box.appendChild(p); setTimeout(() => p.remove(), 5000);
  }
}

// ------------------------------------------------------------
//  Rendu principal
// ------------------------------------------------------------
function render() {
  const app = $("#app");
  let html = "";
  if (!["profiles", "parent-login", "parent", "famille"].includes(view.screen) && !P()) view.screen = "profiles";
  switch (view.screen) {
    case "famille": html = renderFamille(); break;
    case "profiles": html = renderProfiles(); break;
    case "home": html = renderHome(); break;
    case "exercise": html = renderExercise(); break;
    case "reward": html = renderReward(); break;
    case "trophies": html = renderTrophies(); break;
    case "parent-login": html = renderParentLogin(); break;
    case "parent": html = renderParent(); break;
  }
  app.innerHTML = `<div class="fade-in">${html}</div>`;
  const focus = app.querySelector("[data-autofocus]");
  if (focus) focus.focus();
  if (view.screen === "exercise" && view.task.type === "calligraphie") initCanvas();
}

function topbar(showParent = true) {
  const p = P();
  const pts = p ? p.progress.points : 0;
  return `<div class="topbar">
    <div class="brand">🤖 Spot ${p ? `<button class="small ghost" data-action="go" data-screen="profiles" title="Changer d'enfant">👤 ${esc(p.name)} ▾</button>` : ""}</div>
    <div class="stats">
      ${p ? `<div class="pill">⭐ ${pts} pts</div><div class="pill">🏅 Niveau ${levelOf(pts)}</div><button class="small ghost" data-action="go" data-screen="trophies">🏆 Trophées</button>` : ""}
      ${showParent ? `<button class="small ghost" data-action="go" data-screen="parent-login">👨‍👩‍👦 Parent</button>` : ""}
    </div></div>`;
}

// ---------- Choix du profil ----------
function renderProfiles() {
  const cards = Object.values(state.profiles).map((p) => {
    const tasks = p.plan[todayKey()] || [];
    const done = tasks.filter((t) => p.progress.completed[t.id]).length;
    return `<div class="profile-card" data-action="pick-profile" data-id="${p.id}">
      ${spotSVG("happy", "", p)}
      <div class="pname">${esc(p.name)}</div>
      <div class="hint">${esc(p.gradeLabel)} · ⭐ ${p.progress.points} pts</div>
      <div class="hint">${tasks.length ? `Aujourd'hui : ${done} / ${tasks.length} missions` : "Pas de mission aujourd'hui"}</div>
    </div>`;
  }).join("");
  return `${topbar(true)}
    <h2 style="text-align:center">Qui fait ses devoirs ?</h2>
    <div class="profiles">${cards}</div>`;
}

function taskSummary(t) {
  switch (t.type) {
    case "son": { const s = sonByKey(t.son); return `Son « ${s.label} », page ${s.page}`; }
    case "tempete": return `Cartes : ${[].concat(t.rose || [], t.bleu || [], t.jaune || []).join(" ")}`;
    case "etiquettes": return `Mots : ${(t.words || []).join(", ")}`;
    case "calligraphie": { const c = calliByLetter(t.lettre); return `Lettre ${c.l} / ${c.l.toUpperCase()}, page ${c.page}${c.mots.length ? " · " + c.mots.join(", ") : ""}`; }
    case "mots": return `${t.mode === "dicter" ? "Dictée" : "Voir puis écrire"} · ${(t.words || []).length} mots : ${(t.words || []).slice(0, 8).join(", ")}${(t.words || []).length > 8 ? "…" : ""}`;
    case "grille": return `Nombres de 0 à ${t.max}, ${t.count} questions`;
    case "spatial": return `${t.count} questions`;
    case "tables": return `${t.table === 0 ? "Tables mélangées" : "Table du " + t.table} (${t.op}) · ${t.count} questions${t.chrono ? " · chrono" : ""}`;
    case "nombres": return `Nombres de 0 à ${fmtNum(t.max)} · ${t.count} nombres`;
    case "conjug": return `${t.verbe} · ${C3_TEMPS[t.temps] || t.temps}`;
    case "calcul": return `${CALC_MODES[t.op] || t.op} · ${t.count} questions · nombres de ${t.min} à ${t.max}`;
    case "quiz": return `${(t.questions || []).length} question(s)`;
    case "lecture": return `${t.minutes} min · ${t.instructions || ""}`;
    default: return t.instructions || "";
  }
}

// ---------- Accueil ----------
function renderHome() {
  const p = P();
  const day = view.day;
  const tasks = p.plan[day] || [];
  const done = tasks.filter((t) => p.progress.completed[t.id]).length;
  const allDone = tasks.length > 0 && done === tasks.length;
  const isToday = day === todayKey();
  let msg;
  if (tasks.length === 0) msg = line("nothingToday");
  else if (allDone) msg = line("allDone");
  else msg = view.greeting || (view.greeting = line("hello"));
  const dayButtons = DAYS.map((d) => {
    const ts = p.plan[d] || [];
    const all = ts.length > 0 && ts.every((t) => p.progress.completed[t.id]);
    return `<button data-action="day" data-day="${d}" class="${d === day ? "active" : ""} ${d === todayKey() ? "today" : ""}">${DAY_SHORT[d]}${all ? '<span class="dot"></span>' : ""}</button>`;
  }).join("");
  const missions = tasks.length === 0
    ? `<div class="empty">Aucune mission ${isToday ? "aujourd'hui" : "ce jour-là"}. 🎉</div>`
    : tasks.map((t) => {
      const d = !!p.progress.completed[t.id];
      return `<div class="mission ${d ? "done" : ""}" data-action="start" data-task="${t.id}">
        <div class="emoji">${t.emoji || TYPE_EMOJI[t.type] || "📘"}</div>
        <div class="info"><div class="title">${esc(t.title)}</div><div class="subject">${esc(t.subject || "")} · ${TYPE_LABELS[t.type] || ""}</div></div>
        <div class="check">${d ? "✅" : "▶️"}</div></div>`;
    }).join("");
  return `${topbar()}
    <div class="spot-stage">${spotSVG(allDone ? "party" : "happy", allDone ? "bounce" : "")}
      <div class="bubble">${esc(msg)}<div class="speak"><button class="small ghost" data-action="say" data-text="${esc(msg)}">🔊 Écouter Spot</button></div></div></div>
    <div class="days">${dayButtons}</div>
    <h2 style="margin:6px 0">Missions de ${day}${isToday ? " (aujourd'hui)" : ""}</h2>
    ${tasks.length ? `<div class="progressbar"><div style="width:${(done / tasks.length) * 100}%"></div></div>` : ""}
    <div class="missions">${missions}</div>`;
}

function renderTrophies() {
  const p = P();
  const lvl = levelOf(p.progress.points);
  const items = SPOT_UNLOCKS.map((u) => `<div class="trophy ${u.level <= lvl ? "" : "locked"}"><div class="big">${u.emoji}</div><b>${esc(u.name)}</b><div class="hint">Niveau ${u.level}</div></div>`).join("");
  const next = SPOT_UNLOCKS.find((u) => u.level > lvl);
  const toNext = next ? (next.level - 1) * POINTS_PER_LEVEL - p.progress.points : 0;
  return `${topbar()}
    <div class="spot-stage">${spotSVG("happy")}<div class="bubble">Tu as ${p.progress.points} points et ${p.progress.history.length} missions réussies en tout !
      ${next ? `<br>Encore ${toNext} points et je gagne : ${next.emoji} ${esc(next.name)}.` : "<br>Tu as TOUT débloqué, incroyable !"}</div></div>
    <h2>Les accessoires de Spot</h2><div class="trophies">${items}</div>
    <div class="actions"><button data-action="go" data-screen="home">⬅️ Retour</button></div>`;
}

function renderReward() {
  const r = view.reward;
  const stars = "⭐".repeat(r.stars) + "☆".repeat(3 - r.stars);
  return `${topbar(false)}
    <div class="exercise reward">${spotSVG("party", "wiggle")}
      <h1>Mission réussie !</h1><div class="stars">${stars}</div><div class="points">+${r.points} points</div>
      ${r.chrono ? `<div class="unlock">⏱ Temps : <b>${r.chrono}</b>${r.record ? " 🏆 Nouveau record !" : ""}</div>` : ""}
      ${r.unlock ? `<div class="unlock">🎁 Nouveau ! Spot a gagné : <b>${r.unlock.emoji} ${esc(r.unlock.name)}</b></div>` : ""}
      ${r.allDone ? `<div class="unlock">🏁 Toutes les missions du jour sont faites. Bravo !</div>` : ""}
      <div class="actions"><button class="big green" data-action="go" data-screen="home">Continuer ➡️</button></div></div>`;
}

// ------------------------------------------------------------
//  Exercices : cadre commun
// ------------------------------------------------------------
function findTask(id) { const p = P(); for (const d of DAYS) for (const t of p.plan[d] || []) if (t.id === id) return t; return null; }

function startTask(id) {
  const t = findTask(id);
  if (!t) return;
  view.task = t; view.screen = "exercise";
  ex = { step: 0, tries: 0, errors: 0, graded: 0, feedback: "", feedbackKind: "", phase: "", parentOk: false };
  const starters = { calcul: startCalcul, mots: startMots, quiz: startQuiz, lecture: startLecture, son: startSon, tempete: startTempete, etiquettes: startEtiquettes, calligraphie: startCalli, grille: startGrille, spatial: startSpatial, tables: startTables, nombres: startNombres, conjug: startConjug };
  if (starters[t.type]) starters[t.type](t);
  render();
  say(t.title + ". " + line("encourage"));
}

function renderExercise() {
  const t = view.task;
  const renderers = { calcul: exCalcul, mots: exMots, quiz: exQuiz, lecture: exLecture, tache: exTache, son: exSon, tempete: exTempete, etiquettes: exEtiquettes, calligraphie: exCalli, grille: exGrille, spatial: exSpatial, tables: exTables, nombres: exNombres, conjug: exConjug };
  const body = renderers[t.type] ? renderers[t.type](t) : "";
  const mood = ex.feedbackKind === "ko" ? "sad" : ex.feedbackKind === "ok" ? "party" : "think";
  return `${topbar(false)}
    <div class="exercise">
      <div class="row" style="justify-content:space-between;align-items:flex-start">
        <div><h2>${t.emoji || TYPE_EMOJI[t.type]} ${esc(t.title)}</h2><div class="sub">${esc(t.subject || "")}</div></div>
        <div style="width:90px;height:90px;flex:0 0 auto">${spotSVG(mood)}</div>
      </div>
      ${body}
      <div class="actions"><button class="ghost small" data-action="go" data-screen="home">⬅️ Abandonner pour l'instant</button></div>
    </div>`;
}
function feedbackHTML() { return `<div class="feedback ${ex.feedbackKind}">${esc(ex.feedback)}</div>`; }
function parentCheck(label, id = "parentok") {
  return `<div class="checkline"><input type="checkbox" id="${id}" data-action="toggle-parent" ${ex.parentOk ? "checked" : ""}><label for="${id}" style="margin:0">${label}</label></div>`;
}
function stepsBar(labels, current) {
  return `<div class="steps">${labels.map((l, i) => `<span class="${i < current ? "done" : i === current ? "active" : ""}">${l}</span>`).join("")}</div>`;
}
function afterAnswer(correct, expected, next) {
  if (correct) {
    ex.feedback = line("correct"); ex.feedbackKind = "ok"; say(ex.feedback); ex.locked = true;
    render();
    setTimeout(() => { ex.locked = false; ex.tries = 0; ex.feedback = ""; ex.feedbackKind = ""; ex.lastChoice = undefined; next(); }, 900);
  } else {
    ex.tries++; ex.errors++;
    if (ex.tries >= 2) {
      ex.feedback = `La bonne réponse était : ${expected}`; ex.feedbackKind = "ko"; ex.locked = true; ex.showAnswer = true;
      say("La bonne réponse était " + expected);
      render();
      setTimeout(() => { ex.locked = false; ex.tries = 0; ex.feedback = ""; ex.feedbackKind = ""; ex.lastChoice = undefined; ex.showAnswer = false; next(); }, 2200);
    } else {
      ex.feedback = line("wrong"); ex.feedbackKind = "ko"; say(ex.feedback);
      render();
    }
  }
}
function finishTask(extra = {}) {
  const p = P(); const t = view.task;
  const total = ex.graded || 1;
  const ratio = Math.max(0, 1 - ex.errors / (total * 2));
  const stars = ratio >= 0.95 ? 3 : ratio >= 0.7 ? 2 : 1;
  const points = Number(p.settings.pointsPerTask) + (stars === 3 ? 5 : 0);
  const before = levelOf(p.progress.points);
  p.progress.points += points;
  p.progress.completed[t.id] = { date: new Date().toISOString(), stars };
  const hist = { id: t.id, title: t.title, date: new Date().toISOString(), stars, points };
  let record = false;
  if (extra.seconds != null) {
    hist.seconds = extra.seconds;
    const key = t.title;
    p.progress.records = p.progress.records || {};
    if (!p.progress.records[key] || extra.seconds < p.progress.records[key]) { p.progress.records[key] = extra.seconds; record = true; }
  }
  p.progress.history.push(hist);
  if (p.progress.history.length > 300) p.progress.history.splice(0, p.progress.history.length - 300);
  const after = levelOf(p.progress.points);
  const unlock = after > before ? SPOT_UNLOCKS.find((u) => u.level === after) : null;
  const allDone = (p.plan[view.day] || []).every((x) => p.progress.completed[x.id]);
  save();
  view.reward = { stars, points, unlock, allDone, chrono: extra.seconds != null ? fmtTime(extra.seconds) : "", record };
  view.screen = "reward";
  render();
  confetti(allDone ? 160 : 80);
  say(line("taskDone", { points }) + (unlock ? " Et j'ai gagné " + unlock.name + " !" : "") + (allDone ? " " + line("allDone") : ""), false, { bipKind: "win" });
}
function fmtTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
function listenRound(prompt, choices, cls = "") {
  const btns = choices.map((c, i) => {
    let k = ex.lastChoice === i ? ex.feedbackKind : "";
    if (ex.showAnswer && normalize(c) === normalize(ex.target)) k = "ok";
    return `<button data-action="choice" data-index="${i}" class="${k} ${cls}">${esc(c)}</button>`;
  }).join("");
  return `<div class="question text">${prompt}</div>
    <div class="actions" style="margin:0 0 10px"><button class="accent" data-action="say" data-text="${esc(ex.target)}">🔊 Réécouter</button></div>
    <div class="choices ${cls ? "wide" : ""}">${btns}</div>${feedbackHTML()}`;
}
function newListenRound(pool, n = 4) {
  ex.target = ex.queue[ex.step];
  ex.choices = shuffle([ex.target].concat(distractors(pool, ex.target, n - 1)));
  setTimeout(() => say(ex.target, true), 300);
}

// ------------------------------------------------------------
//  Calcul
// ------------------------------------------------------------
function startCalcul(t) { ex.items = genCalc(t); ex.graded = ex.items.length; }
function genCalc(t) {
  const items = [];
  const min = Number(t.min ?? 0), max = Number(t.max ?? 10), count = Number(t.count ?? 6);
  let guard = 0;
  while (items.length < count && guard++ < 600) {
    let a = rnd(min, max), b = rnd(min, max), it = null;
    switch (t.op) {
      case "-": if (b > a) [a, b] = [b, a]; it = { text: `${a} − ${b} = ?`, answer: a - b }; break;
      case "x": it = { text: `${a} × ${b} = ?`, answer: a * b }; break;
      case "plus1": { const plus = Math.random() < 0.5 || a === 0; it = plus ? { text: `${a} + 1 = ?`, answer: a + 1 } : { text: `${a} − 1 = ?`, answer: a - 1 }; break; }
      case "plus2": { const plus = Math.random() < 0.5 || a < 2; it = plus ? { text: `${a} + 2 = ?`, answer: a + 2 } : { text: `${a} − 2 = ?`, answer: a - 2 }; break; }
      case "plus10": { const plus = Math.random() < 0.5 || a < 10; it = plus ? { text: `${a} + 10 = ?`, answer: a + 10 } : { text: `${a} − 10 = ?`, answer: a - 10 }; break; }
      case "doubles": it = { text: `${a} + ${a} = ?`, answer: a + a }; break;
      case "manquant": it = Math.random() < 0.5 ? { text: `${a} + ? = ${a + b}`, answer: b } : { text: `${a + b} − ? = ${a}`, answer: b }; break;
      case "comparer": { const r = a < b ? "<" : a > b ? ">" : "="; it = { text: `${fmtNum(a)}  ?  ${fmtNum(b)}`, answer: r, choices: ["<", ">", "="] }; break; }
      case "grands+": it = { text: `${fmtNum(a)} + ${fmtNum(b)} = ?`, answer: a + b, vertical: [a, b, "+"] }; break;
      case "grands-": if (b > a) [a, b] = [b, a]; it = { text: `${fmtNum(a)} − ${fmtNum(b)} = ?`, answer: a - b, vertical: [a, b, "−"] }; break;
      default: it = { text: `${a} + ${b} = ?`, answer: a + b };
    }
    if (items.some((i) => i.text === it.text) && guard < 500) continue;
    items.push(it);
  }
  return items;
}
function exCalcul() {
  const item = ex.items[ex.step];
  let answerUI;
  if (item.choices) {
    answerUI = `<div class="choices row-choices">${item.choices.map((c, i) => `<button data-action="choice" data-index="${i}" class="${ex.lastChoice === i ? ex.feedbackKind : ""}">${c}</button>`).join("")}</div>`;
  } else {
    answerUI = `<form data-action="answer" class="answer-row"><input type="number" inputmode="numeric" name="answer" data-autofocus autocomplete="off"><button type="submit" class="green">Valider ✔</button></form>`;
  }
  const q = item.vertical
    ? `<div class="vertical"><div>${fmtNum(item.vertical[0])}</div><div>${item.vertical[2]} ${fmtNum(item.vertical[1])}</div><div class="bar">?</div></div>`
    : `<div class="question">${esc(item.text)}</div>`;
  return `<div class="counter">Question ${ex.step + 1} / ${ex.items.length}</div>${q}
    <div class="actions" style="margin:0 0 8px"><button class="ghost small" data-action="say" data-text="${esc(item.text.replace("−", "moins").replace("×", "fois").replace("?", "combien"))}">🔊 Écouter</button></div>
    ${answerUI}${feedbackHTML()}`;
}
function nextCalcul() { ex.step++; if (ex.step >= ex.items.length) finishTask(); else render(); }

// ------------------------------------------------------------
//  Tables (+ − × ÷) avec chrono
// ------------------------------------------------------------
function startTables(t) {
  const n = Number(t.table), count = Number(t.count || 12);
  const items = [];
  const tablesPool = n === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [n];
  let guard = 0;
  while (items.length < count && guard++ < 800) {
    const k = pick(tablesPool), a = rnd(0, 10);
    let it;
    switch (t.op) {
      case "-": it = Math.random() < 0.5 ? { text: `${a + k} − ${k} = ?`, answer: a } : { text: `${a + k} − ${a} = ?`, answer: k }; break;
      case "x": it = Math.random() < 0.5 ? { text: `${k} × ${a} = ?`, answer: k * a } : { text: `${a} × ${k} = ?`, answer: k * a }; break;
      case "÷": { const b = rnd(1, 10); it = Math.random() < 0.5 ? { text: `${k * b} ÷ ${k} = ?`, answer: b } : { text: `${k * b} ÷ ${b} = ?`, answer: k }; break; }
      default: it = Math.random() < 0.5 ? { text: `${k} + ${a} = ?`, answer: k + a } : { text: `${a} + ${k} = ?`, answer: k + a };
    }
    if (items.some((i) => i.text === it.text) && guard < 700) continue;
    items.push(it);
  }
  ex.items = items; ex.graded = items.length; ex.startedAt = Date.now(); ex.chrono = !!t.chrono;
  if (ex.chrono) { clearInterval(timerHandle); timerHandle = setInterval(() => { if (view.screen !== "exercise" || !ex) { clearInterval(timerHandle); return; } const el = $("#chrono"); if (el) el.textContent = fmtTime(Math.floor((Date.now() - ex.startedAt) / 1000)); }, 500); }
}
function exTables(t) {
  const item = ex.items[ex.step];
  const rec = (P().progress.records || {})[t.title];
  return `<div class="counter">Question ${ex.step + 1} / ${ex.items.length}${ex.chrono ? ` · ⏱ <span id="chrono">${fmtTime(Math.floor((Date.now() - ex.startedAt) / 1000))}</span>` : ""}${rec ? ` · record : ${fmtTime(rec)}` : ""}</div>
    <div class="question">${esc(item.text)}</div>
    <form data-action="answer" class="answer-row"><input type="number" inputmode="numeric" name="answer" data-autofocus autocomplete="off"><button type="submit" class="green">Valider ✔</button></form>
    ${feedbackHTML()}`;
}
function nextTables() {
  ex.step++;
  if (ex.step >= ex.items.length) { clearInterval(timerHandle); finishTask(ex.chrono ? { seconds: Math.floor((Date.now() - ex.startedAt) / 1000) } : {}); }
  else render();
}

// ------------------------------------------------------------
//  Lecture des nombres (0 à 10 000)
// ------------------------------------------------------------
function startNombres(t) {
  const max = Number(t.max || 500), count = Number(t.count || 8);
  const set = new Set();
  while (set.size < count) set.add(rnd(0, max));
  ex.items = [...set]; ex.graded = count;
  ex.phase = "ecoute"; // ecoute : Spot dit, j'écris · lis : je lis à voix haute
  setTimeout(() => say(String(ex.items[0]), true), 500);
}
function exNombres() {
  const n = ex.items[ex.step];
  if (ex.phase === "ecoute") {
    return `${stepsBar(["J'écoute et j'écris", "Je lis à voix haute"], 0)}<div class="counter">Nombre ${ex.step + 1} / ${ex.items.length}</div>
      <div class="question text">Écris en chiffres le nombre que Spot dit :</div>
      <form data-action="answer" class="answer-row"><input type="number" inputmode="numeric" name="answer" data-autofocus autocomplete="off"><button type="submit" class="green">Valider ✔</button></form>
      <div class="actions"><button class="accent small" data-action="say" data-text="${n}">🔊 Réécouter</button></div>${feedbackHTML()}`;
  }
  return `${stepsBar(["J'écoute et j'écris", "Je lis à voix haute"], 1)}
    <div class="question text">Lis chaque nombre à voix haute, comme sur ta grille. Touche un nombre pour que Spot le dise.</div>
    <div class="cards">${ex.items.map((x) => `<button class="card" data-action="say" data-text="${x}">${fmtNum(x)}</button>`).join("")}</div>
    ${parentCheck("Un parent m'a écouté lire et a signé la grille")}
    <div class="actions"><button class="big green" data-action="finish" ${ex.parentOk ? "" : "disabled"}>Terminer 🎉</button></div>`;
}
function nextNombres() {
  ex.step++;
  if (ex.step >= ex.items.length) { ex.phase = "lis"; ex.items = shuffle(ex.items); render(); }
  else { render(); setTimeout(() => say(String(ex.items[ex.step]), true), 300); }
}

// ------------------------------------------------------------
//  Conjugaison
// ------------------------------------------------------------
function startConjug(t) {
  const v = C3_VERBES[t.verbe] || C3_VERBES.aimer;
  const temps = t.temps || "present";
  if (temps === "participe") { ex.items = [{ pronom: "", forme: v.participe, prompt: `Participe présent de « ${t.verbe} » :` }]; }
  else ex.items = shuffle(C3_PRONOMS.map((pr, i) => ({ pronom: pr, forme: v[temps][i], prompt: `${C3_PRONOMS_LABEL[pr]} ___` })));
  ex.graded = ex.items.length; ex.phase = "table";
}
function exConjug(t) {
  const v = C3_VERBES[t.verbe]; const temps = t.temps || "present";
  if (ex.phase === "table") {
    const rows = temps === "participe" ? `<div class="conj-row"><span>${esc(t.verbe)} →</span><b>${esc(v.participe)}</b></div>`
      : C3_PRONOMS.map((pr, i) => `<div class="conj-row"><span>${C3_PRONOMS_LABEL[pr]}</span><b>${esc(v[temps][i])}</b></div>`).join("");
    return `${stepsBar(["Je lis le tableau", "Je conjugue"], 0)}
      <div class="question text">${esc(t.verbe.toUpperCase())} · ${C3_TEMPS[temps]}</div>
      <div class="conj-table">${rows}</div>
      <div class="actions"><button class="ghost" data-action="say" data-text="${esc(temps === "participe" ? v.participe : C3_PRONOMS.map((pr, i) => (pr === "il" ? "il" : pr) + " " + v[temps][i]).join(". "))}">🔊 Spot récite</button><button class="big accent" data-action="conj-go">Je suis ${G("prêt", "prête")} 🙈</button></div>`;
  }
  const it = ex.items[ex.step];
  return `${stepsBar(["Je lis le tableau", "Je conjugue"], 1)}<div class="counter">${ex.step + 1} / ${ex.items.length} · ${esc(t.verbe)} · ${C3_TEMPS[temps]}</div>
    <div class="question text">${esc(it.prompt)}</div>
    <form data-action="answer" class="answer-row"><input type="text" name="answer" data-autofocus autocomplete="off" autocapitalize="off" spellcheck="false" style="max-width:320px;font-size:1.4rem"><button type="submit" class="green">Valider ✔</button></form>
    <div class="hint" style="text-align:center">Écris seulement le verbe, sans le pronom. Attention aux accents !</div>${feedbackHTML()}`;
}
function nextConjug() { ex.step++; if (ex.step >= ex.items.length) finishTask(); else render(); }

// ------------------------------------------------------------
//  Mots (voir puis écrire / dictée)
// ------------------------------------------------------------
function startMots(t) {
  ex.items = shuffle(t.words || []); ex.graded = ex.items.length;
  ex.phase = t.mode === "dicter" ? "type" : "show";
  ex.regle = t.liste ? (listeByKey(t.liste) || {}).regle : "";
  if (t.mode === "dicter") setTimeout(() => say(ex.items[0], true), 600);
}
function exMots(t) {
  const word = ex.items[ex.step];
  const dicter = t.mode === "dicter";
  const regle = ex.regle ? `<div class="hint" style="text-align:center">💡 ${esc(ex.regle)}</div>` : "";
  if (ex.phase === "show") {
    return `<div class="counter">Mot ${ex.step + 1} / ${ex.items.length}</div>${regle}${feedbackHTML()}
      <p style="text-align:center;font-size:1.2rem">Regarde bien le mot, puis cache-le !</p>
      <div class="word-card">${esc(word)}</div>
      <div class="actions"><button class="ghost" data-action="say" data-text="${esc(word)}">🔊 Écouter</button><button class="accent big" data-action="hide-word">Je suis ${G("prêt", "prête")} 🙈</button></div>`;
  }
  return `<div class="counter">Mot ${ex.step + 1} / ${ex.items.length}</div>${regle}
    <div class="question text">${dicter ? "Écris le mot que Spot a dit :" : "Écris le mot que tu as vu :"}</div>
    <form data-action="answer" class="answer-row"><input type="text" name="answer" data-autofocus autocomplete="off" autocapitalize="off" spellcheck="false" style="max-width:340px"><button type="submit" class="green">Valider ✔</button></form>
    <div class="actions"><button class="accent small" data-action="say" data-text="${esc(word)}">🔊 Réécouter le mot</button></div>${feedbackHTML()}`;
}
function nextMots() {
  ex.step++; ex.phase = view.task.mode === "dicter" ? "type" : "show";
  if (ex.step >= ex.items.length) finishTask(); else { render(); if (view.task.mode === "dicter") setTimeout(() => say(ex.items[ex.step], true), 400); }
}

// ------------------------------------------------------------
//  Quiz, lecture, tâche
// ------------------------------------------------------------
function startQuiz(t) { ex.items = (t.questions || []).slice(); ex.graded = ex.items.length; }
function exQuiz() {
  const q = ex.items[ex.step];
  const choices = q.choices.map((c, i) => {
    let cls = ex.lastChoice === i ? ex.feedbackKind : "";
    if (ex.showAnswer && i === Number(q.answer)) cls = "ok";
    return `<button data-action="choice" data-index="${i}" class="${cls}">${esc(c)}</button>`;
  }).join("");
  return `<div class="counter">Question ${ex.step + 1} / ${ex.items.length}</div>
    <div class="question text">${esc(q.q)}</div>
    <div class="actions" style="margin:0 0 10px"><button class="ghost small" data-action="say" data-text="${esc(q.q + ". " + q.choices.join(", ou, "))}">🔊 Écouter la question</button></div>
    <div class="choices">${choices}</div>${feedbackHTML()}`;
}
function nextQuiz() { ex.step++; if (ex.step >= ex.items.length) finishTask(); else render(); }
function startLecture(t) { ex.remaining = (t.minutes || 10) * 60; ex.running = false; }
function exLecture(t) {
  const m = Math.floor(ex.remaining / 60), s = ex.remaining % 60;
  const finished = ex.remaining <= 0;
  return `<div class="instructions">${esc(t.instructions || "Lis pendant " + t.minutes + " minutes.")}</div>
    <div class="actions" style="margin-top:10px"><button class="ghost small" data-action="say" data-text="${esc(t.instructions || "")}">🔊 Écouter la consigne</button></div>
    <div class="timer">${finished ? "⏰ Terminé !" : `${m}:${String(s).padStart(2, "0")}`}</div>
    <div class="actions">
      ${!finished && !ex.running ? `<button class="big accent" data-action="timer-start">▶️ Démarrer la lecture</button>` : ""}
      ${ex.running ? `<button class="ghost" data-action="timer-pause">⏸ Pause</button>` : ""}
    </div>
    ${parentCheck("Un parent a vérifié ma lecture")}
    <div class="actions"><button class="big green" data-action="finish" ${ex.parentOk ? "" : "disabled"}>J'ai terminé ! 🎉</button></div>`;
}
function exTache(t) {
  return `<div class="instructions">${esc(t.instructions || "")}</div>${parentCheck("C'est fait !", "taskok")}
    <div class="actions"><button class="big green" data-action="finish" ${ex.parentOk ? "" : "disabled"}>Valider la mission 🎉</button></div>`;
}
let timerHandle = null;
function timerStart() {
  ex.running = true; clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    if (view.screen !== "exercise" || !ex || !ex.running) { clearInterval(timerHandle); return; }
    ex.remaining--;
    if (ex.remaining <= 0) { ex.remaining = 0; ex.running = false; clearInterval(timerHandle); say("Bip bip ! Le temps de lecture est terminé. Bravo !"); }
    render();
  }, 1000);
  render();
}

// ------------------------------------------------------------
//  1re année : cahier des sons, tempête, étiquettes, calligraphie, grille, spatial
// ------------------------------------------------------------
const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyzéèê".split("");
const ALL_DIGRAPHS = ["ou", "on", "in", "an", "en", "oi", "au", "eau", "ai", "ei", "eu", "ch", "qu"];
function startSon(t) {
  const s = sonByKey(t.son); ex.son = s;
  ex.phases = ["lettres"];
  if (s.syll && s.syll.length) ex.phases.push("syllabes", "ecoute-syll");
  if (s.mots && s.mots.length) ex.phases.push("mots", "ecoute-mots");
  if (s.phrases && s.phrases.length) ex.phases.push("phrases");
  ex.phaseIndex = 0; ex.phase = "lettres"; ex.round = 0; ex.rounds = 2;
  newLetterGrid();
}
function phaseLabel(p) { return { lettres: "Je reconnais", syllabes: "Je lis les syllabes", "ecoute-syll": "J'écoute", mots: "Je lis les mots", "ecoute-mots": "J'écoute", phrases: "Je lis les phrases" }[p]; }
function newLetterGrid() {
  const s = ex.son; const target = s.key; const isDigraph = target.length > 1;
  const pool = isDigraph ? ALL_DIGRAPHS.concat(["a", "o", "u", "e", "i"]) : ALL_LETTERS;
  const nTargets = 6, nTotal = 18; const tiles = [];
  for (let i = 0; i < nTargets; i++) tiles.push({ txt: target, target: true, font: i % LETTER_FONTS, upper: !isDigraph && i % 2 === 1, found: false });
  distractors(pool, target, nTotal - nTargets).forEach((d, i) => tiles.push({ txt: d, target: false, font: (i + 2) % LETTER_FONTS, upper: d.length === 1 && Math.random() < 0.4 }));
  ex.grid = shuffle(tiles); ex.graded += nTargets;
}
function nextSonPhase() {
  ex.phaseIndex++;
  if (ex.phaseIndex >= ex.phases.length) { finishTask(); return; }
  ex.phase = ex.phases[ex.phaseIndex]; ex.step = 0; ex.feedback = ""; ex.feedbackKind = "";
  const s = ex.son;
  if (ex.phase === "ecoute-syll") { ex.queue = shuffle(s.syll).slice(0, 5); ex.graded += ex.queue.length; newListenRound(s.syll); }
  if (ex.phase === "ecoute-mots") { ex.queue = shuffle(s.mots).slice(0, 5); ex.graded += ex.queue.length; newListenRound(s.mots); }
  render();
}
function exSon() {
  const s = ex.son; const head = stepsBar(ex.phases.map(phaseLabel), ex.phaseIndex);
  if (ex.phase === "lettres") {
    const remaining = ex.grid.filter((g) => g.target && !g.found).length;
    const tiles = ex.grid.map((g, i) => `<button class="tile lf${g.font} ${g.found ? "found" : ""} ${g.shake ? "shake" : ""}" data-action="tile" data-index="${i}" ${g.found ? "disabled" : ""}>${esc(g.upper ? g.txt.toUpperCase() : g.txt)}</button>`).join("");
    return `${head}<div class="question text">Touche tous les « ${esc(s.label)} » ! <span class="hint">(encore ${remaining})</span></div>
      <div class="actions" style="margin:0 0 8px"><button class="ghost small" data-action="say-sound" data-s="${esc(s.key)}">🔊 Spot dit le son</button><span class="hint">Manche ${ex.round + 1} / ${ex.rounds}</span></div>
      <div class="tiles">${tiles}</div>${feedbackHTML()}`;
  }
  if (ex.phase === "syllabes" || ex.phase === "mots") {
    const list = ex.phase === "syllabes" ? s.syll : s.mots;
    return `${head}<div class="question text">${ex.phase === "syllabes" ? "Lis chaque syllabe à voix haute." : "Lis chaque mot à voix haute."} Touche pour entendre Spot.</div>
      <div class="cards">${list.map((w) => `<button class="card" data-action="say" data-text="${esc(w)}">${esc(w)}</button>`).join("")}</div>
      <div class="actions"><button class="big green" data-action="son-next">J'ai tout lu ✔</button></div>`;
  }
  if (ex.phase === "ecoute-syll" || ex.phase === "ecoute-mots") return `${head}<div class="counter">${ex.step + 1} / ${ex.queue.length}</div>` + listenRound("Spot dit quelque chose. Trouve-le !", ex.choices);
  if (ex.phase === "phrases") {
    return `${head}<div class="question text">Lis les phrases. Les mots soulignés à l'école sont des mots-étiquettes.</div>
      <div class="sentences">${s.phrases.map((p) => `<div class="sentence"><span>${esc(p)}</span><button class="icon ghost" data-action="say" data-text="${esc(p)}">🔊</button></div>`).join("")}</div>
      ${parentCheck("J'ai lu les phrases avec un parent")}
      <div class="actions"><button class="big green" data-action="finish" ${ex.parentOk ? "" : "disabled"}>Terminer 🎉</button></div>`;
  }
  return "";
}
function tileTap(i) {
  const g = ex.grid[i]; if (!g || g.found) return;
  if (g.target) {
    g.found = true; ex.feedback = ""; ex.feedbackKind = "";
    if (ex.grid.every((x) => !x.target || x.found)) {
      ex.feedback = line("correct"); ex.feedbackKind = "ok"; say(ex.feedback); render();
      setTimeout(() => { ex.feedback = ""; ex.feedbackKind = ""; ex.round++; if (ex.round < ex.rounds) { newLetterGrid(); render(); } else nextSonPhase(); }, 900);
      return;
    }
    render();
  } else {
    ex.errors++; g.shake = true; ex.feedback = "Pas celle-là ! Cherche « " + ex.son.label + " »."; ex.feedbackKind = "ko"; say("Pas celle-là !");
    render(); setTimeout(() => { g.shake = false; }, 500);
  }
}
function startTempete(t) {
  const cards = [];
  for (const s of t.rose || []) cards.push({ s, grp: "rose" });
  for (const s of t.bleu || []) cards.push({ s, grp: "bleu" });
  for (const s of t.jaune || []) cards.push({ s, grp: "jaune" });
  ex.pile = shuffle(cards); ex.total = cards.length; ex.done = 0; ex.retries = 0; ex.graded = cards.length; ex.startedAt = Date.now();
}
function exTempete() {
  const c = ex.pile[0]; const elapsed = Math.floor((Date.now() - ex.startedAt) / 1000);
  return `<div class="counter">Carte ${ex.done + 1} / ${ex.total} · à revoir : ${ex.retries} · ⏱ ${elapsed}s</div>
    <div class="legend"><span class="sw rose"></span>voyelles <span class="sw bleu"></span>consonnes <span class="sw jaune"></span>sons amoureux</div>
    <div class="flash ${c.grp}">${esc(c.s)}</div>
    <p style="text-align:center;font-size:1.15rem">Dis le son à voix haute, vite comme une tempête !</p>
    <div class="actions"><button class="ghost" data-action="say-sound" data-s="${esc(c.s)}">🔊 Spot vérifie</button><button class="red" data-action="tempete-retry">🔁 À revoir</button><button class="big green" data-action="tempete-ok">✅ Je l'ai dit !</button></div>`;
}
function tempeteNext(ok) {
  const c = ex.pile.shift();
  if (ok) ex.done++; else { ex.retries++; ex.errors++; ex.pile.push(c); }
  if (ex.pile.length === 0) { finishTask(); return; }
  render();
}
function startEtiquettes(t) {
  ex.words = (t.words || []).slice(); ex.phase = "photo"; ex.step = 0; ex.order = shuffle(ex.words);
  ex.pool = ex.words.length >= 4 ? ex.words : ex.words.concat(Object.values(ETIQUETTES).flat());
}
function exEtiquettes() {
  const head = stepsBar(["Le photographe", "La pêche"], ex.phase === "photo" ? 0 : 1);
  if (ex.phase === "photo") {
    const w = ex.order[ex.step];
    return `${head}<div class="counter">Mot ${ex.step + 1} / ${ex.order.length}</div>
      <div class="question text">Lis le mot du premier coup d'œil, comme une photo !</div><div class="word-card">${esc(w)}</div>
      <div class="actions"><button class="ghost" data-action="say" data-text="${esc(w)}">🔊 Spot le dit</button><button class="big green" data-action="etiq-next">Suivant ➡️</button></div>`;
  }
  return `${head}<div class="counter">Poisson ${ex.step + 1} / ${ex.queue.length}</div>` + listenRound("🎣 Spot dit un mot. Attrape-le !", ex.choices, "wide");
}
function etiqNext() {
  ex.step++;
  if (ex.step < ex.order.length) { render(); return; }
  ex.phase = "peche"; ex.step = 0; ex.queue = shuffle(ex.words); ex.graded = ex.queue.length;
  newListenRound(ex.pool); render();
}
function startCalli(t) { const c = calliByLetter(t.lettre); ex.calli = c; ex.items = [c.l, c.l.toUpperCase()].concat(c.mots); ex.step = 0; ex.graded = 1; }
function exCalli() {
  const c = ex.calli; const item = ex.items[ex.step];
  const fam = { coccinelle: "🐞 lettre coccinelle (petite)", girafe: "🦒 lettre girafe (grande)", singe: "🐒 lettre singe (qui descend)" }[c.famille];
  const last = ex.step === ex.items.length - 1;
  return `<div class="counter">${ex.step + 1} / ${ex.items.length} · ${fam}</div>
    <div class="question text">Trace « ${esc(item)} » avec ton doigt ou la souris, en respectant les trottoirs.</div>
    <div class="canvas-wrap"><canvas id="trace" width="720" height="260"></canvas></div>
    <div class="actions"><button class="ghost" data-action="canvas-clear">🧽 Effacer</button><button class="ghost" data-action="say" data-text="${esc(item.length === 1 ? "La lettre " + item : item)}">🔊</button>${last ? "" : `<button class="big accent" data-action="calli-next">Suivant ➡️</button>`}</div>
    ${last ? parentCheck("J'ai aussi fait ma page " + c.page + " dans le cahier de calligraphie") + `<div class="actions"><button class="big green" data-action="finish" ${ex.parentOk ? "" : "disabled"}>Terminer 🎉</button></div>` : ""}`;
}
let drawing = false, lastPt = null;
function initCanvas() {
  const cv = $("#trace"); if (!cv) return;
  const ctx = cv.getContext("2d"); const item = ex.items[ex.step];
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.strokeStyle = "#9db4d6"; ctx.lineWidth = 2; ctx.setLineDash([]);
  [40, 220].forEach((y) => { ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(cv.width - 10, y); ctx.stroke(); });
  ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(10, 130); ctx.lineTo(cv.width - 10, 130); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = "#d9e2f1"; ctx.font = "bold 170px 'Comic Sans MS', 'Segoe Print', sans-serif"; ctx.textBaseline = "alphabetic";
  const w = ctx.measureText(item).width; const scale = Math.min(1, (cv.width - 40) / w);
  ctx.save(); ctx.translate(30, 220); ctx.scale(scale, scale); ctx.fillText(item, 0, 0); ctx.restore();
  const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
  cv.onpointerdown = (e) => { drawing = true; lastPt = pos(e); cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = (e) => { if (!drawing) return; const p = pos(e); ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(lastPt.x, lastPt.y); ctx.lineTo(p.x, p.y); ctx.stroke(); lastPt = p; };
  cv.onpointerup = cv.onpointercancel = () => { drawing = false; };
}
function startGrille(t) { ex.max = Number(t.max || 19); ex.count = Number(t.count || 8); ex.step = 0; ex.graded = ex.count; newGrilleQuestion(); }
function newGrilleQuestion() {
  const max = ex.max; const kinds = ["trouve", "trouve", "apres", "avant", "entre"]; if (max >= 19) kinds.push("plus10", "moins10");
  const k = pick(kinds); let n, q, answer, speak;
  switch (k) {
    case "apres": n = rnd(0, max - 1); q = `Quel nombre vient juste après ${n} ?`; answer = n + 1; break;
    case "avant": n = rnd(1, max); q = `Quel nombre vient juste avant ${n} ?`; answer = n - 1; break;
    case "entre": n = rnd(0, max - 2); q = `Quel nombre est entre ${n} et ${n + 2} ?`; answer = n + 1; break;
    case "plus10": n = rnd(0, max - 10); q = `${n} + 10, ça fait quel nombre ? (descends d'une rangée)`; answer = n + 10; speak = `${n} plus 10, ça fait quel nombre ?`; break;
    case "moins10": n = rnd(10, max); q = `${n} − 10, ça fait quel nombre ? (monte d'une rangée)`; answer = n - 10; speak = `${n} moins 10, ça fait quel nombre ?`; break;
    default: n = rnd(0, max); q = `Touche le nombre que Spot dit : 🔊`; answer = n; speak = `Touche le nombre ${n}`;
  }
  ex.q = q; ex.answer = answer; ex.speak = speak || q; ex.kind = k;
  setTimeout(() => say(ex.speak, true), 300);
}
function exGrille() {
  const cells = [];
  for (let i = 0; i <= ex.max; i++) { let cls = ex.lastChoice === i ? ex.feedbackKind : ""; if (ex.showAnswer && i === ex.answer) cls = "ok"; cells.push(`<button class="cell ${cls}" data-action="cell" data-n="${i}">${i}</button>`); }
  return `<div class="counter">Question ${ex.step + 1} / ${ex.count}</div><div class="question text">${esc(ex.q)}</div>
    <div class="actions" style="margin:0 0 8px"><button class="accent small" data-action="say" data-text="${esc(ex.speak)}">🔊 Réécouter</button></div>
    <div class="grid10">${cells.join("")}</div>${feedbackHTML()}`;
}
function nextGrille() { ex.step++; if (ex.step >= ex.count) finishTask(); else { newGrilleQuestion(); render(); } }
const SPATIAL_POS = {
  "en haut": { x: 11, y: 10, z: 1, label: "en haut de l'échelle" }, "en bas": { x: 11, y: 84, z: 1, label: "en bas de l'échelle" },
  "à gauche": { x: 30, y: 62, z: 1, label: "à gauche de Spot" }, "à droite": { x: 70, y: 62, z: 1, label: "à droite de Spot" },
  devant: { x: 50, y: 84, z: 2, label: "devant Spot" }, derrière: { x: 50, y: 26, z: 0, label: "derrière Spot" },
  sur: { x: 88, y: 42, z: 1, label: "sur la table" }, sous: { x: 88, y: 78, z: 1, label: "sous la table" },
};
function startSpatial(t) { ex.count = Number(t.count || 6); ex.step = 0; ex.graded = ex.count; newSpatialQuestion(); }
function newSpatialQuestion() {
  ex.mode = ex.step % 2 === 0 ? "ou" : "place"; ex.rel = pick(SPATIAL);
  if (ex.mode === "ou") { ex.choices = shuffle([ex.rel].concat(distractors(SPATIAL, ex.rel, 3))); ex.q = "Où est le ballon ?"; ex.speak = "Où est le ballon ?"; }
  else { ex.q = `Mets le ballon ${SPATIAL_POS[ex.rel].label}.`; ex.speak = ex.q; }
  setTimeout(() => say(ex.speak, true), 300);
}
function sceneHTML(ballRel, zones) {
  const ball = (rel) => { const p = SPATIAL_POS[rel]; return `<div class="ball" style="left:${p.x}%;top:${p.y}%;z-index:${p.z}">⚽</div>`; };
  const zoneEls = zones ? SPATIAL.map((r) => { const p = SPATIAL_POS[r]; let cls = ex.lastZone === r ? ex.feedbackKind : ""; if (ex.showAnswer && r === ex.rel) cls = "ok"; return `<button class="zone ${cls}" data-action="zone" data-rel="${r}" style="left:${p.x}%;top:${p.y}%;z-index:3"></button>`; }).join("") : "";
  return `<div class="scene"><div class="ladder">🪜</div><div class="spot-mini">${spotSVG("happy")}</div><div class="table"><div class="top"></div><div class="leg l"></div><div class="leg r"></div></div>${ballRel ? ball(ballRel) : ""}${zoneEls}</div>`;
}
function exSpatial() {
  const head = `<div class="counter">Question ${ex.step + 1} / ${ex.count}</div><div class="question text">${esc(ex.q)}</div>
    <div class="actions" style="margin:0 0 8px"><button class="accent small" data-action="say" data-text="${esc(ex.speak)}">🔊 Réécouter</button></div>`;
  if (ex.mode === "ou") {
    const btns = ex.choices.map((c, i) => { let k = ex.lastChoice === i ? ex.feedbackKind : ""; if (ex.showAnswer && c === ex.rel) k = "ok"; return `<button data-action="choice" data-index="${i}" class="${k}">${esc(SPATIAL_POS[c].label)}</button>`; }).join("");
    return head + sceneHTML(ex.rel, false) + `<div class="choices">${btns}</div>` + feedbackHTML();
  }
  return head + sceneHTML(null, true) + `<p class="hint" style="text-align:center">Touche un cercle pointillé.</p>` + feedbackHTML();
}
function nextSpatial() { ex.step++; ex.lastZone = undefined; if (ex.step >= ex.count) finishTask(); else { newSpatialQuestion(); render(); } }

// ------------------------------------------------------------
//  Réponses : aiguillage par type
// ------------------------------------------------------------
function nextForType() {
  const t = view.task.type;
  if (t === "calcul") return nextCalcul;
  if (t === "tables") return nextTables;
  if (t === "nombres") return nextNombres;
  if (t === "conjug") return nextConjug;
  if (t === "mots") return nextMots;
  if (t === "quiz") return nextQuiz;
  if (t === "grille") return nextGrille;
  if (t === "spatial") return nextSpatial;
  if (t === "etiquettes") return () => { ex.step++; if (ex.step >= ex.queue.length) finishTask(); else { newListenRound(ex.pool); render(); } };
  if (t === "son") return () => { ex.step++; if (ex.step >= ex.queue.length) nextSonPhase(); else { newListenRound(ex.phase === "ecoute-syll" ? ex.son.syll : ex.son.mots); render(); } };
  return () => render();
}
function handleChoice(i) {
  if (ex.locked) return;
  const t = view.task.type; ex.lastChoice = i;
  if (t === "quiz") { const q = ex.items[ex.step]; afterAnswer(i === Number(q.answer), q.choices[q.answer], nextQuiz); return; }
  if (t === "calcul") { const it = ex.items[ex.step]; afterAnswer(it.choices[i] === it.answer, it.answer, nextCalcul); return; }
  if (t === "spatial") { afterAnswer(ex.choices[i] === ex.rel, SPATIAL_POS[ex.rel].label, nextSpatial); return; }
  afterAnswer(normalize(ex.choices[i]) === normalize(ex.target), ex.target, nextForType());
}
function handleTyped(raw) {
  if (ex.locked) return;
  const t = view.task.type;
  if (t === "calcul" || t === "tables") { const it = ex.items[ex.step]; afterAnswer(Number(raw) === it.answer, String(it.answer), nextForType()); return; }
  if (t === "nombres") { const n = ex.items[ex.step]; afterAnswer(Number(String(raw).replace(/\s/g, "")) === n, fmtNum(n), nextNombres); return; }
  if (t === "conjug") {
    const it = ex.items[ex.step];
    let a = normalizeStrict(raw);
    // on tolère le pronom devant
    a = a.replace(/^(j'|je |tu |il |elle |on |nous |vous |ils |elles )/, "").trim();
    afterAnswer(a === normalizeStrict(it.forme), it.forme, nextConjug); return;
  }
  if (t === "mots") {
    const w = ex.items[ex.step];
    const strict = P().grade >= 3; // en 3e année, les accents comptent
    const ok = strict ? normalizeStrict(raw) === normalizeStrict(w) : normalize(raw) === normalize(w);
    if (!ok && ex.tries < 1 && view.task.mode !== "dicter") ex.phase = "show";
    afterAnswer(ok, w, nextMots);
  }
}

// ------------------------------------------------------------
//  Zone Parent
// ------------------------------------------------------------
function PP() { return state.profiles[view.parentProfile] || P() || Object.values(state.profiles)[0]; }
function renderParentLogin() {
  const dots = "●".repeat(view.pin.length);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((k) => `<button data-action="pin" data-key="${k}">${k}</button>`).join("");
  return `${topbar(false)}<div class="parent" style="max-width:420px;margin:0 auto;text-align:center">
      <h2>Zone Parent 🔒</h2><p class="hint">Entre le NIP (par défaut : 1234)</p>
      <div class="pin-display">${dots || "&nbsp;"}</div>${view.pinError ? `<div class="feedback ko">NIP incorrect</div>` : ""}
      <div class="pinpad">${keys}</div><button class="ghost" data-action="go" data-screen="${P() ? "home" : "profiles"}">⬅️ Retour</button></div>`;
}
function renderParent() {
  if (!view.parentProfile) view.parentProfile = state.current || Object.keys(state.profiles)[0];
  const p = PP();
  const profTabs = Object.values(state.profiles).map((x) => `<button data-action="pprofile" data-id="${x.id}" class="${x.id === p.id ? "active" : ""}">${esc(x.name)} (${esc(x.gradeLabel)})</button>`).join("");
  const tabs = [["semaine", "📅 Semaine"], ["banque", "📚 Banque"], ["suivi", "📈 Suivi"], ["reglages", "⚙️ Réglages"]]
    .map(([k, l]) => `<button data-action="ptab" data-tab="${k}" class="${view.parentTab === k ? "active" : ""}">${l}</button>`).join("");
  let body = "";
  if (view.parentTab === "semaine") body = parentWeek(p);
  if (view.parentTab === "banque") body = parentLibrary(p);
  if (view.parentTab === "suivi") body = parentTracking(p);
  if (view.parentTab === "reglages") body = parentSettings(p);
  return `${topbar(false)}<div class="parent">
      <div class="row" style="justify-content:space-between"><h2 style="margin:0">Zone Parent</h2><button class="ghost small" data-action="go" data-screen="${P() ? "home" : "profiles"}">⬅️ Retour à Spot</button></div>
      <div class="sep"></div><div class="tabs profile-tabs">${profTabs}</div><div class="tabs">${tabs}</div>${body}</div>`;
}
function parentWeek(p) {
  if (view.edit) return taskForm(p);
  const day = view.day;
  const dayTabs = DAYS.map((d) => `<button data-action="day" data-day="${d}" class="${d === day ? "active" : ""}">${DAY_SHORT[d]} (${(p.plan[d] || []).length})</button>`).join("");
  const tasks = p.plan[day] || [];
  const rows = tasks.length === 0 ? `<div class="empty">Aucune mission ce jour-là.</div>` : tasks.map((t, i) => `<div class="task-row">
      <div style="font-size:1.6rem">${t.emoji || TYPE_EMOJI[t.type]}</div>
      <div class="info"><b>${esc(t.title)} ${p.progress.completed[t.id] ? "✅" : ""}</b><span>${esc(t.subject || "")} · ${TYPE_LABELS[t.type]} · ${esc(taskSummary(t))}</span></div>
      <div class="btns">
        <button class="icon ghost" data-action="move" data-index="${i}" data-dir="-1" title="Monter">⬆️</button>
        <button class="icon ghost" data-action="move" data-index="${i}" data-dir="1" title="Descendre">⬇️</button>
        <button class="icon ghost" data-action="edit" data-index="${i}" title="Modifier">✏️</button>
        <button class="icon ghost" data-action="copy-day" data-index="${i}" title="Copier vers un autre jour">📋</button>
        <button class="icon ghost" data-action="delete" data-index="${i}" title="Supprimer">🗑️</button>
      </div></div>`).join("");
  const libOptions = p.library.map((l, i) => `<option value="${i}">${esc(l.emoji || "")} ${esc(l.title)} (${TYPE_LABELS[l.type]})</option>`).join("");
  const tip = p.grade === 1
    ? "Le lundi, quand tu reçois le nouveau plan d'étude, mets à jour la page du son, la lettre de calligraphie, le groupe de mots-étiquettes et la grille."
    : "Le lundi, quand tu reçois le nouveau plan d'étude, mets à jour la liste de vocabulaire, la table à mémoriser, la grille de lecture des nombres et les pages de grammaire.";
  return `<h3 style="margin:8px 0">Plan de ${esc(p.name)}</h3><div class="days">${dayTabs}</div>
    <h3 style="margin:8px 0">Missions de ${day}</h3>${rows}
    <div class="form-box"><div class="row">
        <button class="green" data-action="new">➕ Nouvelle mission</button><span>ou</span>
        <select id="libpick" style="max-width:340px"><option value="">Choisir dans la banque…</option>${libOptions}</select>
        <button data-action="add-from-lib">Ajouter</button></div>
      <div class="hint" style="margin-top:10px">Astuce : 📋 copie une mission vers un autre jour (ou « tous » pour lundi à vendredi). ${tip}</div>
      <div class="row" style="margin-top:10px"><button class="ghost small" data-action="clear-day">🧹 Vider ${day}</button><button class="ghost small" data-action="clear-week">🧹 Vider toute la semaine</button></div></div>`;
}
function emptyDraft(type, grade) {
  const maths = ["grille", "spatial", "calcul", "quiz", "tables", "nombres"].includes(type);
  return { id: uid(), type, title: "", subject: maths ? "Maths" : type === "tache" ? "Organisation" : type === "conjug" ? "Conjugaison" : type === "mots" && grade >= 3 ? "Vocabulaire" : "Français",
    emoji: TYPE_EMOJI[type], instructions: "", minutes: grade >= 3 ? 15 : 10, words: [], op: "+", min: 0, max: grade >= 3 ? 500 : 10, count: grade >= 3 ? 12 : 8, questions: [],
    son: "f", rose: TEMPETE_DEFAUT.rose.slice(), bleu: TEMPETE_DEFAUT.bleu.slice(), jaune: TEMPETE_DEFAUT.jaune.slice(),
    groupe: "A", lettre: "a", bloc: "1", liste: "1.1", mode: grade >= 3 ? "dicter" : "voir", table: 3, chrono: true, verbe: "aimer", temps: "present" };
}
function autoTitle(d, grade) {
  switch (d.type) {
    case "son": { const s = sonByKey(d.son); return `Le son ${s.label} (page ${s.page})`; }
    case "tempete": return "Tempête de sons";
    case "etiquettes": return d.groupe === "perso" ? "Mots-étiquettes" : `Mots-étiquettes ${d.groupe}`;
    case "calligraphie": { const c = calliByLetter(d.lettre); return `Calligraphie : la lettre ${c.l} (page ${c.page})`; }
    case "mots": {
      if (grade >= 3) { const l = listeByKey(d.liste); return d.liste === "courants" ? "Mots courants (page 1)" : d.liste === "perso" || !l ? "Mots à écrire" : `Liste ${l.key} : ${l.titre}`; }
      return d.bloc === "perso" ? "Mots d'orthographe" : `Mots d'orthographe, bloc ${d.bloc}`;
    }
    case "grille": return `Grille de nombres 0 à ${d.max}`;
    case "spatial": return "Les relations spatiales";
    case "tables": { const op = { "+": "Additions", "-": "Soustractions", x: "Multiplications", "÷": "Divisions" }[d.op] || "Table"; return Number(d.table) === 0 ? `${op} : tables mélangées` : `${op} du ${d.table}`; }
    case "nombres": return `Lecture des nombres 0 à ${fmtNum(d.max)}`;
    case "conjug": return `Conjuguer ${String(d.verbe).toUpperCase()} · ${C3_TEMPS[d.temps] || ""}`;
    case "calcul": return CALC_MODES[d.op] || "Calcul";
    case "lecture": return grade >= 3 ? "Lecture : 15 minutes" : "Petits livres (reliure verte)";
    default: return TYPE_LABELS[d.type];
  }
}
function opt(list, val, fmt) { return list.map((x) => { const [v, l] = fmt(x); return `<option value="${esc(v)}" ${String(val) === String(v) ? "selected" : ""}>${esc(l)}</option>`; }).join(""); }
function taskForm(p) {
  const e = view.edit, d = e.draft, grade = p.grade;
  const typeOpts = TYPES_BY_GRADE[grade].map((k) => `<option value="${k}" ${d.type === k ? "selected" : ""}>${TYPE_EMOJI[k]} ${TYPE_LABELS[k]}</option>`).join("");
  let specific = "";
  switch (d.type) {
    case "lecture": specific = `<label>Consigne</label><textarea name="instructions">${esc(d.instructions)}</textarea><label>Durée (minutes)</label><input type="number" name="minutes" value="${d.minutes}" min="1" max="60">`; break;
    case "tache": specific = `<label>Consigne</label><textarea name="instructions">${esc(d.instructions)}</textarea>`; break;
    case "son": specific = `<label>Page du cahier des sons</label><select name="son">${opt(SONS, d.son, (s) => [s.key, `${s.label} — page ${s.page}`])}</select>
      <div class="hint">Déroulement : reconnaître la lettre, lire les syllabes, écouter et trouver, lire les mots, écouter et trouver, lire les phrases avec un parent.</div>`; break;
    case "tempete": specific = `<label>Cartes roses (voyelles), séparées par des virgules</label><input name="rose" value="${esc((d.rose || []).join(", "))}">
      <label>Cartes bleues (consonnes)</label><input name="bleu" value="${esc((d.bleu || []).join(", "))}"><label>Cartes mauves (sons amoureux)</label><input name="jaune" value="${esc((d.jaune || []).join(", "))}">`; break;
    case "etiquettes": specific = `<label>Groupe de mots-étiquettes</label><select name="groupe" data-action="fill-words">${opt(Object.keys(ETIQUETTES).concat(["perso"]), d.groupe, (g) => [g, g === "perso" ? "Mes propres mots" : `Mots-étiquettes ${g} : ${ETIQUETTES[g].join(", ")}`])}</select>
      <label>Mots (un par ligne ou séparés par des virgules)</label><textarea name="words">${esc((d.words || []).join("\n"))}</textarea>`; break;
    case "calligraphie": specific = `<label>Lettre</label><select name="lettre">${opt(CALLI, d.lettre, (c) => [c.l, `${c.l} / ${c.l.toUpperCase()} — page ${c.page}${c.mots.length ? " (" + c.mots.join(", ") + ")" : ""}`])}</select>`; break;
    case "mots":
      if (grade >= 3) specific = `<label>Liste de vocabulaire (cahier d'étude)</label><select name="liste" data-action="fill-words">${opt(C3_LISTES.map((l) => l.key).concat(["courants", "perso"]), d.liste, (k) => { const l = listeByKey(k); return [k, k === "courants" ? "Mots courants (page 1)" : k === "perso" ? "Mes propres mots" : `${l.key} ${l.titre} (${l.mots.length} mots)`]; })}</select>
        <label>Mots (un par ligne ou séparés par des virgules)</label><textarea name="words">${esc((d.words || []).join("\n"))}</textarea>
        <label>Mode</label><select name="mode"><option value="dicter" ${d.mode === "dicter" ? "selected" : ""}>Spot dicte le mot (dictée)</option><option value="voir" ${d.mode === "voir" ? "selected" : ""}>Spot montre le mot, puis le cache</option></select>
        <div class="hint">Les accents comptent en 3e année. Les mots « hors-la-loi » de la liste ne sont pas inclus automatiquement : ajoute-les au besoin.</div>`;
      else specific = `<label>Bloc de mots d'orthographe</label><select name="bloc" data-action="fill-words">${opt(Object.keys(ORTHO).concat(["perso"]), d.bloc, (b) => [b, b === "perso" ? "Mes propres mots" : `Bloc ${b} : ${ORTHO[b].join(", ")}`])}</select>
        <label>Mots (un par ligne ou séparés par des virgules)</label><textarea name="words">${esc((d.words || []).join("\n"))}</textarea>
        <label>Mode</label><select name="mode"><option value="voir" ${d.mode === "voir" ? "selected" : ""}>Spot montre le mot, puis le cache (photographe)</option><option value="dicter" ${d.mode === "dicter" ? "selected" : ""}>Spot dicte le mot (dictée)</option></select>`;
      break;
    case "grille": specific = `<div class="form-grid"><div><label>Nombres de 0 à…</label><select name="max">${opt(GRILLE_MAX_CHOIX, d.max, (m) => [m, `0 à ${m}`])}</select></div><div><label>Nombre de questions</label><input type="number" name="count" value="${d.count}" min="3" max="20"></div></div>`; break;
    case "spatial": specific = `<label>Nombre de questions</label><input type="number" name="count" value="${d.count}" min="3" max="16">`; break;
    case "tables": specific = `<div class="form-grid">
      <div><label>Opération</label><select name="op">${opt(["+", "-", "x", "÷"], d.op, (o) => [o, { "+": "Addition (+)", "-": "Soustraction (−)", x: "Multiplication (×)", "÷": "Division (÷)" }[o]])}</select></div>
      <div><label>Table</label><select name="table">${opt([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0], d.table, (n) => [n, n === 0 ? "Toutes les tables mélangées (défi)" : `Table du ${n}`])}</select></div>
      <div><label>Nombre de questions</label><input type="number" name="count" value="${d.count}" min="5" max="40"></div>
      <div><label>Chronomètre</label><select name="chrono"><option value="1" ${d.chrono ? "selected" : ""}>Oui, avec record à battre</option><option value="0" ${!d.chrono ? "selected" : ""}>Non</option></select></div></div>`; break;
    case "nombres": specific = `<div class="form-grid"><div><label>Grille (cartable Maison)</label><select name="max">${opt(C3_GRILLES_NOMBRES, d.max, (g) => [g.max, `Page ${g.page} · 0 à ${fmtNum(g.max)}`]).replace(/(<option[^>]*selected[^>]*>)/, "$1")}</select></div><div><label>Nombre de nombres</label><input type="number" name="count" value="${d.count}" min="4" max="20"></div></div>
      <div class="hint">Spot dicte des nombres à écrire en chiffres, puis l'enfant lit des nombres à voix haute et le parent signe la grille.</div>`; break;
    case "conjug": specific = `<div class="form-grid"><div><label>Verbe</label><select name="verbe">${opt(Object.keys(C3_VERBES), d.verbe, (v) => [v, v])}</select></div>
      <div><label>Temps</label><select name="temps">${opt(Object.keys(C3_TEMPS), d.temps, (t) => [t, C3_TEMPS[t]])}</select></div></div>`; break;
    case "calcul": {
      const ops = grade >= 3 ? ["+", "-", "x", "grands+", "grands-", "manquant", "comparer", "doubles", "plus10"] : Object.keys(CALC_MODES).filter((k) => !k.startsWith("grands"));
      specific = `<div class="form-grid"><div><label>Type de calcul</label><select name="op">${opt(ops, d.op, (k) => [k, CALC_MODES[k]])}</select></div>
      <div><label>Nombre de questions</label><input type="number" name="count" value="${d.count}" min="1" max="30"></div>
      <div><label>Plus petit nombre</label><input type="number" name="min" value="${d.min}"></div><div><label>Plus grand nombre</label><input type="number" name="max" value="${d.max}"></div></div>`; break;
    }
    case "quiz": {
      const rows = (d.questions || []).map((q, i) => `<div class="qa-row">
        <input name="q_${i}" placeholder="Question" value="${esc(q.q)}"><input name="c0_${i}" placeholder="Choix A" value="${esc(q.choices[0] || "")}"><input name="c1_${i}" placeholder="Choix B" value="${esc(q.choices[1] || "")}"><input name="c2_${i}" placeholder="Choix C" value="${esc(q.choices[2] || "")}">
        <select name="a_${i}"><option value="0" ${q.answer == 0 ? "selected" : ""}>Bonne : A</option><option value="1" ${q.answer == 1 ? "selected" : ""}>Bonne : B</option><option value="2" ${q.answer == 2 ? "selected" : ""}>Bonne : C</option></select>
        <button type="button" class="icon ghost" data-action="q-del" data-index="${i}">🗑️</button></div>`).join("");
      specific = `<label>Questions</label>${rows}<button type="button" class="small ghost" data-action="q-add">➕ Ajouter une question</button>`; break;
    }
  }
  return `<form data-action="save-task">
    <h3 style="margin:0 0 8px">${e.index === null ? "Nouvelle mission" : "Modifier la mission"} — ${esc(p.name)}, ${view.day}</h3>
    <div class="form-grid">
      <div><label>Type</label><select name="type" data-action="change-type">${typeOpts}</select></div>
      <div><label>Émoji</label><input name="emoji" value="${esc(d.emoji)}" maxlength="4"></div>
      <div><label>Titre (laisse vide pour un titre automatique)</label><input name="title" value="${esc(d.title)}" placeholder="${esc(autoTitle(d, grade))}"></div>
      <div><label>Matière</label><input name="subject" value="${esc(d.subject)}"></div>
    </div>${specific}
    <div class="actions" style="justify-content:flex-start">
      <button type="submit" class="green">💾 Enregistrer</button>
      <button type="button" class="ghost" data-action="save-to-lib">📚 Enregistrer aussi dans la banque</button>
      <button type="button" class="ghost" data-action="cancel-edit">Annuler</button></div></form>`;
}
function splitList(s) { return String(s || "").split(/[\n,;]+/).map((w) => w.trim()).filter(Boolean); }
function readForm(form) {
  const d = view.edit.draft; const f = new FormData(form);
  const g = (k) => (f.has(k) ? String(f.get(k)) : undefined);
  d.type = g("type") || d.type; d.emoji = g("emoji") || TYPE_EMOJI[d.type];
  d.title = (g("title") || "").trim(); d.subject = (g("subject") || "").trim();
  if (g("instructions") !== undefined) d.instructions = g("instructions").trim();
  if (g("minutes") !== undefined) d.minutes = Number(g("minutes")) || 10;
  if (g("words") !== undefined) d.words = splitList(g("words"));
  if (g("son") !== undefined) d.son = g("son");
  if (g("rose") !== undefined) { d.rose = splitList(g("rose")); d.bleu = splitList(g("bleu")); d.jaune = splitList(g("jaune")); }
  for (const k of ["groupe", "lettre", "bloc", "liste", "mode", "op", "verbe", "temps"]) if (g(k) !== undefined) d[k] = g(k);
  for (const k of ["max", "min", "table"]) if (g(k) !== undefined) d[k] = Number(g(k));
  if (g("count") !== undefined) d.count = Number(g("count")) || 6;
  if (g("chrono") !== undefined) d.chrono = g("chrono") === "1";
  if (d.type === "quiz") {
    const qs = [];
    for (let i = 0; f.has("q_" + i); i++) {
      const q = (g("q_" + i) || "").trim();
      const choices = [g("c0_" + i), g("c1_" + i), g("c2_" + i)].map((c) => (c || "").trim()).filter(Boolean);
      if (q && choices.length >= 2) qs.push({ q, choices, answer: Math.min(Number(g("a_" + i)), choices.length - 1) });
    }
    d.questions = qs;
  }
  return d;
}
const KEEP = { lecture: ["instructions", "minutes"], tache: ["instructions"], son: ["son"], tempete: ["rose", "bleu", "jaune"], etiquettes: ["groupe", "words"],
  calligraphie: ["lettre"], mots: ["bloc", "liste", "words", "mode"], grille: ["max", "count"], spatial: ["count"], tables: ["op", "table", "count", "chrono"],
  nombres: ["max", "count"], conjug: ["verbe", "temps"], calcul: ["op", "min", "max", "count"], quiz: ["questions"] };
function cleanTask(d, grade) {
  const out = { id: d.id, type: d.type, title: d.title || autoTitle(d, grade), subject: d.subject, emoji: d.emoji || TYPE_EMOJI[d.type] };
  for (const k of KEEP[d.type] || []) if (d[k] !== undefined) out[k] = d[k];
  return out;
}
function validateTask(d) {
  if ((d.type === "mots" || d.type === "etiquettes") && d.words.length === 0) return "Ajoute au moins un mot.";
  if (d.type === "quiz" && d.questions.length === 0) return "Ajoute au moins une question avec deux choix.";
  if (d.type === "tempete" && d.rose.length + d.bleu.length + d.jaune.length === 0) return "Ajoute au moins une carte.";
  return "";
}
function fillWords(d, grade) {
  if (d.type === "etiquettes" && ETIQUETTES[d.groupe]) d.words = ETIQUETTES[d.groupe].slice();
  if (d.type === "mots" && grade < 3 && ORTHO[d.bloc]) d.words = ORTHO[d.bloc].slice();
  if (d.type === "mots" && grade >= 3) { if (d.liste === "courants") d.words = C3_MOTS_COURANTS.slice(); else { const l = listeByKey(d.liste); if (l) d.words = l.mots.slice(); } }
}
function parentLibrary(p) {
  const rows = p.library.length === 0 ? `<div class="empty">La banque est vide.</div>` : p.library.map((t, i) => `<div class="task-row">
    <div style="font-size:1.6rem">${t.emoji || TYPE_EMOJI[t.type]}</div>
    <div class="info"><b>${esc(t.title)}</b><span>${esc(t.subject || "")} · ${TYPE_LABELS[t.type]} · ${esc(taskSummary(t))}</span></div>
    <div class="btns"><button class="icon ghost" data-action="lib-del" data-index="${i}" title="Supprimer">🗑️</button></div></div>`).join("");
  return `<p class="hint">Banque de ${esc(p.name)} : missions réutilisables. Depuis l'onglet Semaine, ajoute-les à n'importe quel jour.</p>${rows}`;
}
function parentTracking(p) {
  const h = p.progress.history.slice().reverse().slice(0, 40);
  const rows = h.length === 0 ? `<div class="empty">Aucune mission réussie pour l'instant.</div>` : h.map((r) => `<div class="task-row">
    <div class="info"><b>${esc(r.title)}</b><span>${new Date(r.date).toLocaleString("fr-CA", { dateStyle: "medium", timeStyle: "short" })} · ${"⭐".repeat(r.stars)} · +${r.points} pts${r.seconds != null ? " · ⏱ " + fmtTime(r.seconds) : ""}</span></div></div>`).join("");
  const weekDone = Object.keys(p.progress.completed).length;
  const weekTotal = DAYS.reduce((n, d) => n + (p.plan[d] || []).length, 0);
  const recs = Object.entries(p.progress.records || {}).map(([k, v]) => `<div class="pill">⏱ ${esc(k)} : ${fmtTime(v)}</div>`).join("");
  return `<div class="row"><div class="pill">⭐ ${p.progress.points} points</div><div class="pill">🏅 Niveau ${levelOf(p.progress.points)}</div>
      <div class="pill">📅 Cette semaine : ${weekDone} / ${weekTotal}</div><div class="pill">🎯 Total : ${p.progress.history.length} missions</div></div>
    ${recs ? `<div class="sep"></div><h3>Records de vitesse</h3><div class="row">${recs}</div>` : ""}
    <div class="sep"></div><h3>Dernières missions réussies</h3>${rows}<div class="sep"></div>
    <div class="row"><button class="ghost" data-action="reset-week">🔄 Recommencer la semaine (garde les points)</button></div>`;
}
function voiceSettingsHTML(s) {
  const voices = frenchVoices(); const auto = pickVoice("");
  const nm = (v) => v.name.replace("Microsoft ", "").replace(/ - French.*$/, "");
  const opts = voices.map((v) => `<option value="${esc(v.name)}" ${s.voiceName === v.name ? "selected" : ""}>${esc(nm(v))} (${v.lang})${/natural|online/i.test(v.name) ? " ⭐" : ""}</option>`).join("");
  return `<div class="form-grid">
      <div><label>Voix</label><select name="voiceName"><option value="">Automatique${auto ? " : " + esc(nm(auto)) : ""}</option>${opts}</select>
        <div class="hint">${voices.length === 0 ? "Aucune voix française trouvée dans ce navigateur." : voices.length + " voix française(s). Les voix ⭐ (Edge) sont les plus naturelles."}</div></div>
      <div><label>Bips de robot avant que Spot parle</label><select name="bips"><option value="1" ${s.bips ? "selected" : ""}>Oui, bip bip !</option><option value="0" ${!s.bips ? "selected" : ""}>Non</option></select></div>
      <div><label>Hauteur de la voix : <output id="pitchOut">${Number(s.pitch).toFixed(1)}</output> (1 = normale, 2 = très aiguë)</label><input type="range" name="pitch" min="0.6" max="2" step="0.1" value="${s.pitch}" oninput="document.getElementById('pitchOut').value=Number(this.value).toFixed(1)"></div>
      <div><label>Vitesse : <output id="rateOut">${Number(s.rate).toFixed(2)}</output> (1 = normale)</label><input type="range" name="rate" min="0.6" max="1.5" step="0.05" value="${s.rate}" oninput="document.getElementById('rateOut').value=Number(this.value).toFixed(2)"></div></div>
    <div class="hint">Pour une voix plus naturelle sur Windows, ouvre l'application dans <b>Microsoft Edge</b> : il propose des voix « Natural » en français canadien.</div>`;
}
function parentSettings(p) {
  const s = p.settings;
  return `<form data-action="save-settings"><h3 style="margin:0 0 8px">Réglages de ${esc(p.name)}</h3><div class="form-grid">
      <div><label>Prénom</label><input name="childName" value="${esc(p.name)}"></div>
      <div><label>Spot lui parle au…</label><select name="gender"><option value="m" ${p.gender !== "f" ? "selected" : ""}>Masculin (prêt, champion)</option><option value="f" ${p.gender === "f" ? "selected" : ""}>Féminin (prête, championne)</option></select></div>
      <div><label>Points par mission</label><input type="number" name="pointsPerTask" value="${s.pointsPerTask}" min="1"></div>
      <div><label>Voix de Spot</label><select name="voice"><option value="1" ${s.voice ? "selected" : ""}>Activée</option><option value="0" ${!s.voice ? "selected" : ""}>Désactivée</option></select></div>
      <div><label>NIP parent (commun aux deux enfants)</label><input name="pin" value="${esc(state.pin)}" pattern="[0-9]{4}" maxlength="4"></div>
    </div>
    <div class="sep"></div><h3>L'apparence de Spot 🤖</h3>
    <div class="form-grid">
      <div><label>Couleur du corps</label><input type="color" name="body" value="${esc(p.spot.body || "#5b8def")}" style="height:46px"></div>
      <div><label>Lunettes</label><select name="lunettes"><option value="" ${!p.spot.lunettes ? "selected" : ""}>Aucune</option>${opt(["#8b5cf6", "#ec4899", "#ef4444", "#22c55e", "#f59e0b", "#111111"], p.spot.lunettes, (c) => [c, { "#8b5cf6": "Mauves", "#ec4899": "Roses", "#ef4444": "Rouges", "#22c55e": "Vertes", "#f59e0b": "Jaunes", "#111111": "Noires" }[c]])}</select></div>
    </div>
    <div class="sep"></div><h3>La voix de Spot 🎙️</h3>${voiceSettingsHTML(s)}
    <div class="actions" style="justify-content:flex-start"><button type="submit" class="green">💾 Enregistrer</button><button type="button" class="accent" data-action="voice-test">🔊 Essayer cette voix</button></div></form>
  <div class="sep"></div><h3>Synchronisation entre appareils ☁️</h3>
  <p class="hint">${esc(syncStatusLabel())}</p>
  ${typeof syncAvailable === "function" && syncAvailable() ? `<div class="row"><button class="ghost small" data-action="change-family">🔐 Changer le code famille</button></div>` : ""}
  <div class="sep"></div><h3>Sauvegarde</h3>
  <p class="hint">Exporte un fichier pour garder une copie de sécurité des données des deux enfants.</p>
  <div class="row"><button data-action="export">⬇️ Exporter (fichier JSON)</button><label style="margin:0"><input type="file" accept="application/json" data-action="import" style="width:auto"></label></div>
  <div class="danger-zone"><b>Zone sensible (${esc(p.name)})</b><div class="row" style="margin-top:8px">
      <button class="red small" data-action="reset-progress">Remettre les points à zéro</button>
      <button class="red small" data-action="reset-profile">Revenir au plan d'étude par défaut</button></div></div>`;
}

// ------------------------------------------------------------
//  Événements (délégation)
// ------------------------------------------------------------
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || el.tagName === "FORM" || el.tagName === "INPUT" || el.tagName === "SELECT") return;
  const a = el.dataset.action;

  if (a === "pick-profile") { state.current = el.dataset.id; save(); view.screen = "home"; view.day = todayKey(); view.greeting = null; render(); say(line("hello")); return; }
  if (a === "go") { view.screen = el.dataset.screen; view.pin = ""; view.pinError = false; view.edit = null; if (view.screen !== "exercise") { ex = null; clearInterval(timerHandle); } render(); return; }
  if (a === "day") { view.day = el.dataset.day; view.edit = null; render(); return; }
  if (a === "say") { say(el.dataset.text, true); return; }
  if (a === "say-sound") { saySound(el.dataset.s); return; }
  if (a === "start") { startTask(el.dataset.task); return; }
  if (!ex && ["hide-word", "choice", "tile", "cell", "zone", "timer-start", "timer-pause", "finish", "son-next", "tempete-ok", "tempete-retry", "etiq-next", "calli-next", "canvas-clear", "conj-go"].includes(a)) return;

  if (a === "hide-word") { ex.phase = "type"; render(); return; }
  if (a === "conj-go") { ex.phase = "type"; render(); return; }
  if (a === "choice") { handleChoice(Number(el.dataset.index)); return; }
  if (a === "tile") { tileTap(Number(el.dataset.index)); return; }
  if (a === "cell") { if (ex.locked) return; const n = Number(el.dataset.n); ex.lastChoice = n; afterAnswer(n === ex.answer, String(ex.answer), nextGrille); return; }
  if (a === "zone") { if (ex.locked) return; const r = el.dataset.rel; ex.lastZone = r; afterAnswer(r === ex.rel, SPATIAL_POS[ex.rel].label, nextSpatial); return; }
  if (a === "timer-start") { timerStart(); return; }
  if (a === "timer-pause") { ex.running = false; render(); return; }
  if (a === "finish") { finishTask(); return; }
  if (a === "son-next") { nextSonPhase(); return; }
  if (a === "tempete-ok") { tempeteNext(true); return; }
  if (a === "tempete-retry") { tempeteNext(false); return; }
  if (a === "etiq-next") { etiqNext(); return; }
  if (a === "calli-next") { ex.step++; render(); return; }
  if (a === "canvas-clear") { initCanvas(); return; }

  // --- Parent ---
  if (a === "pin") {
    const k = el.dataset.key;
    if (k === "⌫") view.pin = view.pin.slice(0, -1);
    else if (k === "OK") { if (view.pin === String(state.pin)) { view.screen = "parent"; view.pin = ""; view.pinError = false; } else { view.pinError = true; view.pin = ""; } }
    else if (view.pin.length < 4) view.pin += k;
    if (view.pin.length === 4 && view.pin === String(state.pin)) { view.screen = "parent"; view.pin = ""; view.pinError = false; }
    render(); return;
  }
  if (a === "pprofile") { view.parentProfile = el.dataset.id; view.edit = null; render(); return; }
  if (a === "ptab") { view.parentTab = el.dataset.tab; view.edit = null; render(); return; }
  const p = PP();
  if (a === "new") { const d = emptyDraft(TYPES_BY_GRADE[p.grade][0], p.grade); view.edit = { index: null, draft: d }; render(); return; }
  if (a === "edit") { const t = p.plan[view.day][Number(el.dataset.index)]; view.edit = { index: Number(el.dataset.index), draft: Object.assign(emptyDraft(t.type, p.grade), deepCopy(t)) }; render(); return; }
  if (a === "cancel-edit") { view.edit = null; render(); return; }
  if (a === "delete") { const t = p.plan[view.day][Number(el.dataset.index)]; if (confirm(`Supprimer « ${t.title} » ?`)) { p.plan[view.day].splice(Number(el.dataset.index), 1); save(); render(); } return; }
  if (a === "clear-day") { if (confirm(`Vider toutes les missions de ${view.day} pour ${p.name} ?`)) { p.plan[view.day] = []; save(); render(); } return; }
  if (a === "clear-week") { if (confirm(`Vider toute la semaine de ${p.name} ? (les points restent)`)) { for (const d of DAYS) p.plan[d] = []; save(); render(); } return; }
  if (a === "move") { const i = Number(el.dataset.index), j = i + Number(el.dataset.dir); const arr = p.plan[view.day]; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; save(); render(); return; }
  if (a === "copy-day") {
    const t = p.plan[view.day][Number(el.dataset.index)];
    const target = prompt("Copier vers quel jour ? (lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche ou « tous »)", "tous");
    if (!target) return;
    const targets = normalize(target) === "tous" ? DAYS.filter((d) => d !== view.day && d !== "samedi" && d !== "dimanche") : DAYS.filter((d) => normalize(d) === normalize(target));
    if (targets.length === 0) { alert("Jour inconnu."); return; }
    for (const d of targets) { const c = deepCopy(t); c.id = uid(); (p.plan[d] = p.plan[d] || []).push(c); }
    save(); render(); return;
  }
  if (a === "add-from-lib") { const sel = $("#libpick"); if (!sel || sel.value === "") return; const c = deepCopy(p.library[Number(sel.value)]); c.id = uid(); (p.plan[view.day] = p.plan[view.day] || []).push(c); save(); render(); return; }
  if (a === "q-add") { readForm(el.closest("form")); view.edit.draft.questions.push({ q: "", choices: ["", "", ""], answer: 0 }); render(); return; }
  if (a === "q-del") { readForm(el.closest("form")); view.edit.draft.questions.splice(Number(el.dataset.index), 1); render(); return; }
  if (a === "save-to-lib") { const d = readForm(el.closest("form")); const err = validateTask(d); if (err) { alert(err); return; } const c = cleanTask(d, p.grade); delete c.id; p.library.push(c); save(); alert("Ajouté à la banque !"); return; }
  if (a === "lib-del") { p.library.splice(Number(el.dataset.index), 1); save(); render(); return; }
  if (a === "reset-week") { if (confirm(`Remettre toutes les missions de la semaine de ${p.name} à « non faites » ?`)) { p.progress.completed = {}; save(); render(); } return; }
  if (a === "reset-progress") { if (confirm(`Remettre les points, le niveau et l'historique de ${p.name} à zéro ?`)) { p.progress = { points: 0, completed: {}, weekStart: mondayOf(new Date()), history: [] }; save(); render(); } return; }
  if (a === "reset-profile") { if (confirm(`Effacer le plan et la banque de ${p.name} et revenir au plan d'étude par défaut ? (les points restent)`)) { const d = DEFAULT_PROFILES()[p.id]; p.plan = d.plan; p.library = d.library; p.planEdition = d.planEdition; p.progress.completed = {}; save(); render(); } return; }
  if (a === "voice-test") {
    const f = new FormData(el.closest("form"));
    say(`Salut ${p.name} ! Je suis Spot, ton robot. Bip bip ! On fait nos missions ensemble ?`, false,
      { voiceName: f.get("voiceName") || "", pitch: Number(f.get("pitch")), rate: Number(f.get("rate")), bips: f.get("bips") === "1", voice: true });
    return;
  }
  if (a === "change-family") { if (confirm("Changer le code famille sur cet appareil ? Les données du nouveau code remplaceront l'affichage ici.")) syncForget(); return; }
  if (a === "skip-family") { view.screen = state.current ? "home" : "profiles"; render(); return; }
  if (a === "export") {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement("a"); aEl.href = url; aEl.download = `spot-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`; aEl.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000); return;
  }
});

document.addEventListener("change", (e) => {
  const el = e.target; const a = el.dataset.action;
  if (a === "toggle-parent") { ex.parentOk = el.checked; render(); return; }
  if (a === "change-type") { readForm(el.closest("form")); const p = PP(); const d = view.edit.draft; const fresh = emptyDraft(el.value, p.grade); fillWords(fresh, p.grade); view.edit.draft = Object.assign(fresh, { id: d.id, title: "" }); render(); return; }
  if (a === "fill-words") { readForm(el.closest("form")); fillWords(view.edit.draft, PP().grade); render(); return; }
  if (a === "import") {
    const file = el.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.profiles) throw new Error("format");
        if (confirm("Remplacer les données actuelles par ce fichier ?")) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); state = load(); save(); render(); alert("Importé !"); }
      } catch (err) { alert("Fichier invalide."); }
    };
    reader.readAsText(file);
  }
});

document.addEventListener("submit", (e) => {
  const form = e.target.closest("form[data-action]");
  if (!form) return;
  e.preventDefault();
  const a = form.dataset.action;
  if (a === "answer") { const v = form.answer.value; if (v.trim() === "") return; handleTyped(v); return; }
  if (a === "set-family") { if (syncSetFamily(form.code.value)) { view.screen = state.current ? "home" : "profiles"; render(); } return; }
  const p = PP();
  if (a === "save-task") {
    const d = readForm(form);
    const err = validateTask(d); if (err) { alert(err); return; }
    const t = cleanTask(d, p.grade);
    p.plan[view.day] = p.plan[view.day] || [];
    if (view.edit.index === null) p.plan[view.day].push(t); else p.plan[view.day][view.edit.index] = t;
    view.edit = null; save(); render(); return;
  }
  if (a === "save-settings") {
    const f = new FormData(form);
    p.name = (f.get("childName") || p.name).trim() || p.name;
    p.gender = f.get("gender") === "f" ? "f" : "m";
    const pin = (f.get("pin") || "").trim(); if (/^\d{4}$/.test(pin)) state.pin = pin;
    p.settings.pointsPerTask = Number(f.get("pointsPerTask")) || 10;
    p.settings.voice = f.get("voice") === "1";
    p.settings.voiceName = f.get("voiceName") || "";
    p.settings.pitch = Number(f.get("pitch")) || 1.5;
    p.settings.rate = Number(f.get("rate")) || 1.05;
    p.settings.bips = f.get("bips") === "1";
    p.spot.body = f.get("body") || "#5b8def";
    p.spot.lunettes = f.get("lunettes") || "";
    save(); view.greeting = null; render(); alert("Réglages enregistrés !");
  }
});

// Démarrage
render();
