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
// {masculin|féminin} : Spot choisit selon le profil (réglage « Spot lui parle au… »)
const SPOT_LINES = {
  hello: [
    "Salut {name} ! {Prêt|Prête} pour nos missions du jour ?",
    "Bip bip ! {name}, mes circuits sont chauds. On commence ?",
    "Bonjour {name} ! J'ai hâte de voir ce que tu vas apprendre aujourd'hui.",
  ],
  allDone: [
    "WOUAH {name} ! Toutes les missions sont réussies ! Tu es {un champion|une championne} !",
    "Mission accomplie ! Mes circuits dansent de joie, {name} !",
  ],
  nothingToday: ["Pas de mission aujourd'hui, {name}. Repose tes neurones !"],
  correct: ["Bravo !", "Exact !", "Super !", "Tu es {fort|forte} !", "Bip bip, c'est ça !", "Génial !"],
  wrong: ["Presque ! Essaie encore.", "Hum, pas tout à fait. Réessaie !", "Mes capteurs disent : encore un essai !"],
  encourage: ["Tu peux le faire !", "Je crois en toi !", "Concentre-toi, {champion|championne} !"],
  taskDone: ["Mission réussie ! {points} points de plus !", "Excellent travail ! {points} points de plus !"],
};

let _n = 0;
const T = (obj) => Object.assign({ id: "d_" + (++_n) }, obj);
const copy = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------
//  CHARLES — 1re année (plan d'étude semaine 7, 19 octobre)
//  Vendredi 23 octobre : journée pédagogique, mission légère.
// ------------------------------------------------------------
function buildCharles() {
  const LIVRES = { type: "lecture", subject: "Français", emoji: "📗", title: "Petits livres (reliure verte)",
    instructions: "Je lis, avec l'aide de mon parent, les petits livres qui sont dans mon sac de lecture. Mon parent signe la section « Signatures » de ma reliure verte.", minutes: 10 };
  const TEMPETE = { type: "tempete", subject: "Français", emoji: "🌪️", title: "Tempête de sons", rose: TEMPETE_DEFAUT.rose, bleu: TEMPETE_DEFAUT.bleu, jaune: TEMPETE_DEFAUT.jaune };
  const ETIQ_F = { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Mots-étiquettes F (page 8)", groupe: "F", words: ETIQUETTES.F };
  const GRILLE29 = { type: "grille", subject: "Maths", emoji: "🔢", title: "Je reconnais les nombres de 0 à 29 (cahier blanc p. 5)", max: 29, count: 8 };
  const COMPARER = { type: "calcul", subject: "Maths", emoji: "⚖️", title: "Les nombres de 0 à 20 : plus petit, plus grand, égal (Numérik p. 8)", op: "comparer", min: 0, max: 20, count: 8 };
  const SON_N = { type: "son", subject: "Français", emoji: "🔊", title: "Le son n", son: "n" };
  const SON_E = { type: "son", subject: "Français", emoji: "🔊", title: "Le son è", son: "è" };

  const plan = {
    lundi: [T(copy(LIVRES)), T(copy(SON_N)), T(copy(ETIQ_F)), T(copy(GRILLE29))],
    mardi: [T(copy(LIVRES)), T(copy(TEMPETE)), T({ type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre s (page 9)", lettre: "s" }), T(copy(COMPARER))],
    mercredi: [T(copy(LIVRES)), T(copy(SON_E)), T(copy(ETIQ_F)), T(copy(GRILLE29))],
    jeudi: [T(copy(LIVRES)), T(copy(TEMPETE)), T({ type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre r (page 10)", lettre: "r" }), T(copy(COMPARER))],
    vendredi: [T(copy(LIVRES)),
      T({ type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac pour lundi", instructions: "Pas d'école aujourd'hui (journée pédagogique). Je mets dans mon sac mes livres de bibliothèque, mon sac de lecture et ma reliure verte signée, mon cartable Maison et ma boîte à lunch." })],
    samedi: [], dimanche: [],
  };
  const library = [
    copy(LIVRES), copy(TEMPETE), copy(GRILLE29), copy(COMPARER), copy(ETIQ_F),
    { type: "spatial", subject: "Maths", emoji: "🧭", title: "Les relations spatiales (Numérik p. 23)", count: 6 },
    { type: "grille", subject: "Maths", emoji: "🔢", title: "Grille de nombres 0 à 19 (cahier blanc p. 2)", max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "1 de plus, 1 de moins", op: "plus1", min: 0, max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "2 de plus, 2 de moins", op: "plus2", min: 0, max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "10 de plus", op: "plus10", min: 0, max: 40, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "👯", title: "Les doubles", op: "doubles", min: 0, max: 10, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "Additions jusqu'à 10", op: "+", min: 0, max: 5, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➖", title: "Soustractions jusqu'à 10", op: "-", min: 0, max: 10, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "❓", title: "Le terme manquant", op: "manquant", min: 0, max: 10, count: 6 },
    { type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac", instructions: "Reliure verte signée, cartable Maison, boîte à lunch." },
  ].concat(QUIZ_MATHS.map((q) => Object.assign({ type: "quiz" }, q)));

  return {
    id: "charles", name: "Charles", grade: 1, gradeLabel: "1re année", gender: "m", planEdition: "2026-10-19",
    spot: { body: "#5b8def", lunettes: "" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [] },
  };
}

// ------------------------------------------------------------
//  CLARA — 3e année (plan d'étude des semaines du 19 au 30 octobre)
//  La même semaine type sert pour les deux semaines.
// ------------------------------------------------------------
function buildClara() {
  const LECTURE = { type: "lecture", subject: "Français", emoji: "📚", title: "Lecture : 15 minutes du livre de mon choix",
    instructions: "Je lis 15 minutes dans le livre de mon choix. Je peux raconter à Spot ou à un parent ce que j'ai lu.", minutes: 15 };
  // Liste 1.4 : 31 mots + 9 hors-la-loi, coupée en trois pour ne pas faire une dictée de 40 mots
  const L14 = C3_LISTES.find((l) => l.key === "1.4");
  const VOCAB_A = { type: "mots", subject: "Vocabulaire", emoji: "🔑", title: "Liste 1.4 : La bonne clé (mots 1 à 16)", liste: "1.4", words: L14.mots.slice(0, 16), mode: "dicter" };
  const VOCAB_B = { type: "mots", subject: "Vocabulaire", emoji: "🔑", title: "Liste 1.4 : La bonne clé (mots 17 à 31)", liste: "1.4", words: L14.mots.slice(16), mode: "dicter" };
  const VOCAB_QU = { type: "mots", subject: "Vocabulaire", emoji: "🔑", title: "Liste 1.4 : les hors-la-loi en « qu »", liste: "1.4", words: L14.horsLaLoi, mode: "voir" };
  const voir = (v) => Object.assign(copy(v), { title: v.title + " (voir puis écrire)", mode: "voir" });
  const ADD4 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 4 (Tam Tam p. 59)", op: "+", table: 4, count: 12, chrono: true };
  const ADD5 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 5 (Tam Tam p. 59)", op: "+", table: 5, count: 12, chrono: true };
  const NOMBRES = { type: "nombres", subject: "Maths", emoji: "🔢", title: "Lecture des nombres 0 à 500 (grille 2, page 2)", max: 500, count: 8 };
  const SIGNATURE_NOMBRES = { type: "tache", subject: "Maths", emoji: "✍️", title: "Lire la grille 2 à un parent et la faire signer",
    instructions: "Je lis à voix haute les nombres de la grille 2 (page 2 du cartable Maison) à un parent, qui signe la page." };

  const plan = {
    lundi: [T(copy(LECTURE)), T(voir(VOCAB_A)), T(copy(ADD4)),
      T({ type: "tache", subject: "Grammaire", emoji: "📖", title: "Lire les pages 14, 15 et 16 du cahier de grammaire", instructions: "Je lis uniquement les pages 14, 15 et 16 de mon cahier de grammaire." })],
    mardi: [T(copy(LECTURE)), T(copy(VOCAB_A)), T(copy(NOMBRES)),
      T({ type: "tache", subject: "Maths", emoji: "📘", title: "Lire les pages 13, 14, 15 et 16 des savoirs Tam Tam", instructions: "Je lis les pages 13 à 16 de mes savoirs Tam Tam." })],
    mercredi: [T(copy(LECTURE)), T(voir(VOCAB_B)), T(copy(ADD5)),
      T({ type: "tache", subject: "Univers social", emoji: "🌍", title: "Révision des stations 5, 6 et 7", instructions: "Je révise uniquement ce qui a été vu en classe dans les stations 5, 6 et 7. Évaluation le 4 novembre." })],
    jeudi: [T(copy(LECTURE)), T(copy(VOCAB_B)), T(copy(VOCAB_QU)), T(copy(SIGNATURE_NOMBRES)),
      T({ type: "tache", subject: "Sciences", emoji: "🔬", title: "Révision de la leçon 2 de sciences", instructions: "Je relis la leçon 2 et j'explique à un parent ce que j'ai retenu." })],
    vendredi: [T(copy(LECTURE)), T(copy(ADD4)), T(copy(ADD5)),
      T({ type: "tache", subject: "Organisation", emoji: "✍️", title: "Correction et signature du contrôle du 16 octobre", instructions: "Je corrige mon contrôle du 16 octobre et je le fais signer par un parent." }),
      T({ type: "tache", subject: "Projet", emoji: "💡", title: "Devoir libre : préparer mon projet", instructions: "Je prépare mon devoir libre pour la semaine du 2 au 6 novembre et j'en parle à un parent." })],
    samedi: [], dimanche: [],
  };
  const library = [
    copy(LECTURE), copy(VOCAB_A), copy(VOCAB_B), copy(VOCAB_QU), copy(ADD4), copy(ADD5), copy(NOMBRES),
    { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 3 (Tam Tam p. 59)", op: "+", table: 3, count: 12, chrono: true },
    { type: "tables", subject: "Maths", emoji: "➖", title: "Soustractions du 3 (Tam Tam p. 59)", op: "-", table: 3, count: 12, chrono: true },
    { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer AIMER au présent", verbe: "aimer", temps: "present" },
    { type: "mots", subject: "Vocabulaire", emoji: "✏️", title: "Liste 1.3 : Le pirate", liste: "1.3", words: C3_LISTES.find((l) => l.key === "1.3").mots, mode: "dicter" },
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
    id: "clara", name: "Clara", grade: 3, gradeLabel: "3e année", gender: "f", planEdition: "2026-10-19",
    spot: { body: "#5b8def", lunettes: "#8b5cf6" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [] },
  };
}

function DEFAULT_PROFILES() { return { charles: buildCharles(), clara: buildClara() }; }
