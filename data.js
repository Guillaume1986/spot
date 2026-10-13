// ============================================================
//  data.js — Profils par défaut (Charles 1re année, Clara 3e année)
//  Le matériel est dans contenu.js (1re) et contenu-clara.js (3e).
//  Les plans ci-dessous reproduisent les plans d'étude reçus.
//  Tout se modifie ensuite dans la zone Parent.
// ============================================================

const PARENT_PIN = "1234";

const BASE_SETTINGS = {
  voice: true,
  voiceName: "",     // vide = Spot choisit la meilleure voix française disponible
  pitch: 1.5,        // hauteur : 1 = normale, 2 = très aiguë (jeune robot)
  rate: 1.05,        // vitesse : 1 = normale
  bips: true,        // petits bips de robot avant que Spot parle
  pointsPerTask: 10,
};

// Accessoires que Spot gagne en montant de niveau (1 niveau = 100 points)
const SPOT_UNLOCKS = [
  { level: 1, id: "base", name: "Spot est prêt !", emoji: "🤖" },
  { level: 2, id: "antenne", name: "Antenne turbo", emoji: "📡" },
  { level: 3, id: "casquette", name: "Casquette rouge", emoji: "🧢" },
  { level: 4, id: "soleil", name: "Lunettes de soleil", emoji: "🕶️" },
  { level: 5, id: "cape", name: "Cape de super-héros", emoji: "🦸" },
  { level: 6, id: "fusee", name: "Réacteurs à fusée", emoji: "🚀" },
  { level: 7, id: "couronne", name: "Couronne dorée", emoji: "👑" },
];

// Phrases de Spot
const SPOT_LINES = {
  hello: [
    "Salut {name} ! Prêt pour nos missions du jour ?",
    "Bip bip ! {name}, mes circuits sont chauds. On commence ?",
    "Bonjour {name} ! J'ai hâte de voir ce que tu vas apprendre aujourd'hui.",
  ],
  allDone: [
    "WOUAH {name} ! Toutes les missions sont réussies ! Tu es un champion !",
    "Mission accomplie ! Mes circuits dansent de joie, {name} !",
  ],
  nothingToday: ["Pas de mission aujourd'hui, {name}. Repose tes neurones !"],
  correct: ["Bravo !", "Exact !", "Super !", "Tu es fort !", "Bip bip, c'est ça !", "Génial !"],
  wrong: ["Presque ! Essaie encore.", "Hum, pas tout à fait. Réessaie !", "Mes capteurs disent : encore un essai !"],
  encourage: ["Tu peux le faire !", "Je crois en toi !", "Concentre-toi, champion !"],
  taskDone: ["Mission réussie ! {points} points de plus !", "Excellent travail ! {points} points de plus !"],
};

let _n = 0;
const T = (obj) => Object.assign({ id: "d_" + (++_n) }, obj);
const copy = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------
//  CHARLES — 1re année (plan d'étude semaine 6, 12 octobre)
// ------------------------------------------------------------
function buildCharles() {
  const LIVRES = { type: "lecture", subject: "Français", emoji: "📗", title: "Petits livres (reliure verte)",
    instructions: "Je lis, avec l'aide de mon parent, les petits livres qui sont dans mon sac de lecture. Mon parent signe la section « Signatures » de ma reliure verte.", minutes: 10 };
  const TEMPETE = { type: "tempete", subject: "Français", emoji: "🌪️", title: "Tempête de sons", rose: TEMPETE_DEFAUT.rose, bleu: TEMPETE_DEFAUT.bleu, jaune: TEMPETE_DEFAUT.jaune };
  const ETIQ_E = { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Mots-étiquettes E (page 8)", groupe: "E", words: ETIQUETTES.E };
  const GRILLE19 = { type: "grille", subject: "Maths", emoji: "🔢", title: "Grille de nombres 0 à 19 (cahier blanc p. 2)", max: 19, count: 8 };
  const SPATIAL_T = { type: "spatial", subject: "Maths", emoji: "🧭", title: "Les relations spatiales (Numérik p. 23)", count: 6 };

  const plan = {
    lundi: [T(copy(LIVRES)), T(copy(TEMPETE)), T(copy(GRILLE19))],
    mardi: [T(copy(LIVRES)), T({ type: "son", subject: "Français", emoji: "🔊", title: "Le son f (page 16)", son: "f" }), T(copy(ETIQ_E)),
      T({ type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre l (page 7)", lettre: "l" })],
    mercredi: [T(copy(LIVRES)), T({ type: "son", subject: "Français", emoji: "🔊", title: "Le son ch (page 21)", son: "ch" }), T(copy(TEMPETE)), T(copy(SPATIAL_T))],
    jeudi: [T(copy(LIVRES)), T(copy(ETIQ_E)), T({ type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre m (page 8)", lettre: "m" }), T(copy(GRILLE19))],
    vendredi: [T(copy(LIVRES)), T(copy(TEMPETE)), T({ type: "son", subject: "Français", emoji: "🔊", title: "Révision : le son f (page 16)", son: "f" }),
      T({ type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac pour lundi", instructions: "Je mets ma reliure verte signée, mon cartable Maison et ma boîte à lunch dans mon sac." })],
    samedi: [], dimanche: [],
  };
  const library = [
    copy(LIVRES), copy(TEMPETE), copy(GRILLE19), copy(SPATIAL_T),
    { type: "calcul", subject: "Maths", emoji: "➕", title: "1 de plus, 1 de moins", op: "plus1", min: 0, max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "2 de plus, 2 de moins", op: "plus2", min: 0, max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "10 de plus", op: "plus10", min: 0, max: 40, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "👯", title: "Les doubles", op: "doubles", min: 0, max: 10, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "Additions jusqu'à 10", op: "+", min: 0, max: 5, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➖", title: "Soustractions jusqu'à 10", op: "-", min: 0, max: 10, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "❓", title: "Le terme manquant", op: "manquant", min: 0, max: 10, count: 6 },
    { type: "calcul", subject: "Maths", emoji: "⚖️", title: "Plus petit, plus grand, égal", op: "comparer", min: 0, max: 20, count: 8 },
    { type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac", instructions: "Reliure verte signée, cartable Maison, boîte à lunch." },
  ].concat(QUIZ_MATHS.map((q) => Object.assign({ type: "quiz" }, q)));

  return {
    id: "charles", name: "Charles", grade: 1, gradeLabel: "1re année",
    spot: { body: "#5b8def", lunettes: "" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [] },
  };
}

// ------------------------------------------------------------
//  CLARA — 3e année (plan d'étude des semaines du 5 au 16 octobre)
// ------------------------------------------------------------
function buildClara() {
  const LECTURE = { type: "lecture", subject: "Français", emoji: "📚", title: "Lecture : 15 minutes du livre de mon choix",
    instructions: "Je lis 15 minutes dans le livre de mon choix. Je peux raconter à Spot ou à un parent ce que j'ai lu.", minutes: 15 };
  const VOCAB = { type: "mots", subject: "Vocabulaire", emoji: "✏️", title: "Liste 1.3 : Le pirate", liste: "1.3", words: C3_LISTES.find((l) => l.key === "1.3").mots, mode: "dicter" };
  const VOCAB_VOIR = Object.assign(copy(VOCAB), { title: "Liste 1.3 : Le pirate (voir puis écrire)", mode: "voir" });
  const TABLE3 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 3 (Tam Tam p. 59)", op: "+", table: 3, count: 12, chrono: true };
  const TABLE3S = { type: "tables", subject: "Maths", emoji: "➖", title: "Soustractions du 3 (Tam Tam p. 59)", op: "-", table: 3, count: 12, chrono: true };
  const NOMBRES = { type: "nombres", subject: "Maths", emoji: "🔢", title: "Lecture des nombres 0 à 500 (grille 1, page 2)", max: 500, count: 8 };
  const GN_QUIZ = Object.assign({ type: "quiz" }, C3_QUIZ_GRAMMAIRE.find((q) => q.title.includes("groupe du nom")));
  const CONJ = { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer AIMER au présent", verbe: "aimer", temps: "present" };

  const plan = {
    lundi: [T(copy(LECTURE)), T(copy(VOCAB_VOIR)), T(copy(TABLE3)),
      T({ type: "tache", subject: "Grammaire", emoji: "📖", title: "Lire les pages 17 et 19 du cahier de grammaire", instructions: "Je lis uniquement les pages 17 et 19 (le groupe du nom) de mon cahier de grammaire." })],
    mardi: [T(copy(LECTURE)), T(copy(VOCAB)), T(copy(NOMBRES)),
      T({ type: "tache", subject: "Maths", emoji: "📘", title: "Lire les pages 12, 13 et 14 des savoirs Tam Tam", instructions: "Figure symétrique, réflexion, frise, tables d'addition et de soustraction." })],
    mercredi: [T(copy(LECTURE)), T(copy(GN_QUIZ)), T(copy(TABLE3S)),
      T({ type: "tache", subject: "Univers social", emoji: "🌍", title: "Révision des unités 1 à 4", instructions: "Je révise mes notes d'univers social avec un parent. Évaluation le 8 octobre." })],
    jeudi: [T(copy(LECTURE)), T(copy(VOCAB)), T(copy(CONJ)), T(copy(NOMBRES))],
    vendredi: [T(copy(LECTURE)), T(copy(TABLE3)), T(Object.assign({ type: "quiz" }, C3_QUIZ_MATHS.find((q) => q.title.includes("figures")))),
      T({ type: "tache", subject: "Organisation", emoji: "✍️", title: "Correction et signature du contrôle", instructions: "Je corrige mon contrôle du 2 octobre et je le fais signer pour le jeudi 15 octobre." }),
      T({ type: "tache", subject: "Projet", emoji: "💡", title: "Devoir libre : préparer mon idée", instructions: "Je choisis mon sujet de devoir libre pour la semaine du 3 au 7 novembre et j'en parle à un parent." })],
    samedi: [], dimanche: [],
  };
  const library = [
    copy(LECTURE), copy(VOCAB), copy(TABLE3), copy(NOMBRES), copy(CONJ),
    { type: "tables", subject: "Maths", emoji: "✖️", title: "Table de multiplication du 2", op: "x", table: 2, count: 12, chrono: true },
    { type: "tables", subject: "Maths", emoji: "➗", title: "Table de division du 2", op: "÷", table: 2, count: 12, chrono: true },
    { type: "tables", subject: "Maths", emoji: "🎯", title: "Défi : additions 1 à 10 mélangées", op: "+", table: 0, count: 15, chrono: true },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "Additions de grands nombres", op: "grands+", min: 100, max: 999, count: 6 },
    { type: "calcul", subject: "Maths", emoji: "➖", title: "Soustractions de grands nombres", op: "grands-", min: 100, max: 999, count: 6 },
    { type: "calcul", subject: "Maths", emoji: "❓", title: "Le terme manquant", op: "manquant", min: 0, max: 50, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "⚖️", title: "Comparer des nombres", op: "comparer", min: 0, max: 1000, count: 8 },
    { type: "mots", subject: "Vocabulaire", emoji: "⭐", title: "Mots courants (page 1)", liste: "courants", words: C3_MOTS_COURANTS, mode: "dicter" },
    { type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac", instructions: "Agenda signé, cahiers, boîte à lunch." },
  ].concat(C3_QUIZ_GRAMMAIRE.map((q) => Object.assign({ type: "quiz" }, q)))
   .concat(C3_QUIZ_MATHS.map((q) => Object.assign({ type: "quiz" }, q)));

  return {
    id: "clara", name: "Clara", grade: 3, gradeLabel: "3e année",
    spot: { body: "#5b8def", lunettes: "#8b5cf6" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [] },
  };
}

function DEFAULT_PROFILES() { return { charles: buildCharles(), clara: buildClara() }; }
