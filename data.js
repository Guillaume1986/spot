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
// slot : l'endroit où Spot le porte. Un seul accessoire par endroit ; l'enfant choisit
// dans sa garde-robe (écran Trophées). Sans choix, Spot porte le plus récent.
const SPOT_UNLOCKS = [
  { level: 1, id: "base", name: "Spot est prêt !", emoji: "🤖" },
  { level: 2, id: "antenne", name: "Antenne turbo", emoji: "📡" },
  { level: 3, id: "casquette", name: "Casquette rouge", emoji: "🧢", slot: "tete" },
  { level: 4, id: "soleil", name: "Lunettes de soleil", emoji: "🕶️", slot: "yeux" },
  { level: 5, id: "cape", name: "Cape de super-héros", emoji: "🦸", slot: "dos" },
  { level: 6, id: "fusee", name: "Réacteurs à fusée", emoji: "🚀", slot: "pieds" },
  { level: 7, id: "couronne", name: "Couronne dorée", emoji: "👑", slot: "tete" },
  { level: 8, id: "noeud", name: "Nœud papillon", emoji: "🎀", slot: "cou" },
  { level: 9, id: "musique", name: "Casque de musique", emoji: "🎧", slot: "oreilles" },
  { level: 10, id: "ailes", name: "Ailes de robot", emoji: "🪽", slot: "dos" },
  { level: 11, id: "magicien", name: "Chapeau de magicien", emoji: "🎩", slot: "tete" },
  { level: 12, id: "chien", name: "Bip, le chien-robot", emoji: "🐶", slot: "ami" },
  { level: 13, id: "planche", name: "Planche volante", emoji: "🛹", slot: "pieds" },
  { level: 14, id: "etoiles", name: "Pluie d'étoiles", emoji: "✨", slot: "effet" },
  { level: 15, id: "dore", name: "Spot tout en or", emoji: "🏅", slot: "peinture" },
  // Accessoires spéciaux : gagnés avec une médaille, pas avec un niveau
  { medal: "halloween", id: "citrouille", name: "Chapeau citrouille", emoji: "🎃", slot: "tete" },
];
const SPOT_SLOTS = { tete: "Sur la tête", yeux: "Sur les yeux", oreilles: "Sur les oreilles", cou: "Au cou", dos: "Dans le dos", pieds: "Aux pieds", ami: "Un ami", effet: "Effet magique", peinture: "Peinture" };

// Médailles : gagnées en accomplissant des exploits. Chacune donne des points bonus.
const MEDAL_BONUS = 20;
const MEDAILLES = [
  { id: "premiere", emoji: "🚀", name: "Décollage", desc: "Réussir sa première mission" },
  { id: "m10", emoji: "🥉", name: "10 missions", desc: "Réussir 10 missions" },
  { id: "m25", emoji: "🥈", name: "25 missions", desc: "Réussir 25 missions" },
  { id: "m50", emoji: "🥇", name: "50 missions", desc: "Réussir 50 missions" },
  { id: "m100", emoji: "💯", name: "100 missions", desc: "Réussir 100 missions" },
  { id: "etoiles10", emoji: "🌟", name: "Chasseur d'étoiles", nameF: "Chasseuse d'étoiles", desc: "Gagner 3 étoiles dans 10 missions" },
  { id: "journee", emoji: "✅", name: "Journée complète", desc: "Finir toutes les missions d'une journée" },
  { id: "journees5", emoji: "🗓️", name: "5 journées complètes", desc: "Finir 5 journées au complet" },
  { id: "dimanche", emoji: "🌞", name: "Super dimanche", desc: "Finir toute la grande journée du dimanche" },
  { id: "serie3", emoji: "🔥", name: "3 jours de suite", desc: "Faire au moins une mission 3 jours de suite" },
  { id: "serie7", emoji: "☄️", name: "7 jours de suite", desc: "Faire au moins une mission 7 jours de suite" },
  { id: "eclair", emoji: "⚡", name: "Éclair", desc: "Battre un record de vitesse" },
  { id: "halloween", emoji: "🎃", name: "Mission d'Halloween", desc: "Réussir une mission pendant la semaine d'Halloween · débloque le chapeau citrouille" },
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
// Organisation de la semaine : le dimanche, grande journée de devoirs avec tout le contenu
// de la semaine qui vient ; du lundi au vendredi, des missions de révision.
const rev = (o, extra = {}) => Object.assign(copy(o), { title: "Révision : " + o.title }, extra);

// ------------------------------------------------------------
//  CHARLES — 1re année (plan d'étude semaine 8, 26 octobre)
//  Dimanche : tout le plan (pages des cahiers comprises).
//  Lundi à vendredi : petits livres + révisions. Vendredi 30 : Halloween à l'école.
// ------------------------------------------------------------
function buildCharles() {
  const LIVRES = { type: "lecture", subject: "Français", emoji: "📗", title: "Petits livres (reliure verte)",
    instructions: "Je lis, avec l'aide de mon parent, les petits livres qui sont dans mon sac de lecture. Mon parent signe la section « Signatures » de ma reliure verte.", minutes: 10 };
  const TEMPETE = { type: "tempete", subject: "Français", emoji: "🌪️", title: "Tempête de sons", rose: TEMPETE_DEFAUT.rose, bleu: TEMPETE_DEFAUT.bleu, jaune: TEMPETE_DEFAUT.jaune };
  const ETIQ_G = { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Mots-étiquettes G (page 8)", groupe: "G", words: ETIQUETTES.G };
  const GRILLE29 = { type: "grille", subject: "Maths", emoji: "🔢", title: "Les nombres de 0 à 29 : les 3 premières rangées de la grille (cahier blanc p. 2)", max: 29, count: 8 };
  const GROUPES2 = { type: "calcul", subject: "Maths", emoji: "👟", title: "Dénombrer avec des groupes de 2 (Numérik p. 9)", op: "groupes2", min: 0, max: 20, count: 8 };
  const SON_EC = { type: "son", subject: "Français", emoji: "🔊", title: "Le son ê", son: "ê" };
  const SON_ET = { type: "son", subject: "Français", emoji: "🔊", title: "Le son ë", son: "ë" };
  const SON_OU = { type: "son", subject: "Français", emoji: "🔊", title: "Le son ou", son: "ou" };
  const CALLI_F = { type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre f (page 11)", lettre: "f" };
  const CALLI_N = { type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre n (page 12)", lettre: "n" };
  const TRESORS = { type: "tache", subject: "Premier devoir", emoji: "🧰", title: "Ma boîte aux trésors : préparer ma présentation",
    instructions: "Mon parent me lit la feuille de consignes qui est dans ma reliure verte. Puis je remplis la feuille aide-mémoire au verso." };
  const REPETER = { type: "tache", subject: "Premier devoir", emoji: "🎤", title: "Ma boîte aux trésors : je répète ma présentation",
    instructions: "Avec ma feuille aide-mémoire, je présente ma boîte aux trésors à un parent, comme si j'étais devant la classe." };

  const plan = {
    lundi: [T(copy(LIVRES)), T(rev(SON_EC)), T(rev(ETIQ_G)), T(rev(GROUPES2))],
    mardi: [T(copy(LIVRES)), T(rev(TEMPETE)), T(rev(SON_OU)), T(rev(GRILLE29)), T(copy(REPETER))],
    mercredi: [T(copy(LIVRES)), T(rev(SON_ET)), T(rev(ETIQ_G)), T(rev(GROUPES2))],
    jeudi: [T(copy(LIVRES)), T(rev(TEMPETE)), T(rev(SON_OU)), T(copy(REPETER)),
      T({ type: "tache", subject: "Organisation", emoji: "🎃", title: "Préparer mon costume et ma contribution d'Halloween", instructions: "Demain, c'est l'Halloween à l'école ! Je prépare mon costume et ma contribution pour le déjeuner collectif." })],
    vendredi: [T(copy(LIVRES)),
      T({ type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac pour lundi", instructions: "Je mets dans mon sac mes livres de bibliothèque, mon sac de lecture et ma reliure verte signée, mon cartable Maison et ma boîte à lunch." })],
    samedi: [],
    dimanche: [T(copy(LIVRES)), T(copy(SON_EC)), T(copy(SON_ET)), T(copy(SON_OU)), T(copy(ETIQ_G)), T(copy(TEMPETE)),
      T(copy(CALLI_F)), T(copy(CALLI_N)), T(copy(GROUPES2)), T(copy(GRILLE29)), T(copy(TRESORS))],
  };
  const library = [
    copy(LIVRES), copy(TEMPETE), copy(GRILLE29), copy(GROUPES2), copy(ETIQ_G), copy(REPETER),
    { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Mots-étiquettes F (page 8)", groupe: "F", words: ETIQUETTES.F },
    { type: "calcul", subject: "Maths", emoji: "⚖️", title: "Les nombres de 0 à 20 : plus petit, plus grand, égal (Numérik p. 8)", op: "comparer", min: 0, max: 20, count: 8 },
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
    id: "charles", name: "Charles", grade: 1, gradeLabel: "1re année", gender: "m", sayName: "Charle", planEdition: "2026-10-26",
    spot: { body: "#5b8def", lunettes: "" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [], medals: {}, stats: {} },
  };
}

// ------------------------------------------------------------
//  CLARA — 3e année (plan d'étude des semaines du 19 au 30 octobre)
//  La même semaine type sert pour les deux semaines.
//  Dimanche : tout le plan. Lundi à vendredi : lecture + révisions.
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

  const GRAMMAIRE = { type: "tache", subject: "Grammaire", emoji: "📖", title: "Lire les pages 14, 15 et 16 du cahier de grammaire", instructions: "Je lis uniquement les pages 14, 15 et 16 de mon cahier de grammaire." };
  const TAMTAM = { type: "tache", subject: "Maths", emoji: "📘", title: "Lire les pages 13, 14, 15 et 16 des savoirs Tam Tam", instructions: "Je lis les pages 13 à 16 de mes savoirs Tam Tam." };
  const US = { type: "tache", subject: "Univers social", emoji: "🌍", title: "Univers social : stations 5, 6 et 7", instructions: "Je révise uniquement ce qui a été vu en classe dans les stations 5, 6 et 7. Évaluation le 4 novembre." };
  const SCIENCES = { type: "tache", subject: "Sciences", emoji: "🔬", title: "Sciences : la leçon 2", instructions: "Je relis la leçon 2 et j'explique à un parent ce que j'ai retenu." };
  // Toute la liste 1.4 en dictée courte : 12 mots tirés au hasard à chaque fois
  const VOCAB_TOUT = { type: "mots", subject: "Vocabulaire", emoji: "🔑", title: "Liste 1.4 : La bonne clé (12 mots au hasard)", liste: "1.4", words: L14.mots.concat(L14.horsLaLoi), mode: "dicter", count: 12 };

  const plan = {
    lundi: [T(copy(LECTURE)), T(rev(VOCAB_A)), T(rev(ADD4))],
    mardi: [T(copy(LECTURE)), T(rev(VOCAB_B)), T(rev(NOMBRES)), T(rev(ADD5))],
    mercredi: [T(copy(LECTURE)), T(rev(VOCAB_QU, { mode: "dicter" })), T(rev(ADD4)),
      T(rev(US, { instructions: "Je redis à un parent ce que je retiens des stations 5, 6 et 7. Évaluation le 4 novembre." }))],
    jeudi: [T(copy(LECTURE)), T(rev(VOCAB_TOUT)), T(rev(NOMBRES)), T(rev(ADD5))],
    vendredi: [T(copy(LECTURE)), T(rev(VOCAB_TOUT)), T(rev(ADD4)),
      T(rev(SCIENCES, { instructions: "Je redis à un parent ce que je retiens de la leçon 2 de sciences." }))],
    samedi: [],
    dimanche: [T(copy(LECTURE)), T(voir(VOCAB_A)), T(voir(VOCAB_B)), T(copy(VOCAB_QU)), T(copy(ADD4)), T(copy(ADD5)),
      T(copy(NOMBRES)), T(copy(SIGNATURE_NOMBRES)), T(copy(GRAMMAIRE)), T(copy(TAMTAM)), T(copy(US)), T(copy(SCIENCES)),
      T({ type: "tache", subject: "Organisation", emoji: "✍️", title: "Correction et signature du contrôle du 16 octobre", instructions: "Je corrige mon contrôle du 16 octobre et je le fais signer par un parent." }),
      T({ type: "tache", subject: "Projet", emoji: "💡", title: "Devoir libre : préparer mon projet", instructions: "Je prépare mon devoir libre pour la semaine du 2 au 6 novembre et j'en parle à un parent." })],
  };
  const library = [
    copy(LECTURE), copy(VOCAB_A), copy(VOCAB_B), copy(VOCAB_QU), copy(VOCAB_TOUT), copy(ADD4), copy(ADD5), copy(NOMBRES),
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
    id: "clara", name: "Clara", grade: 3, gradeLabel: "3e année", gender: "f", planEdition: "2026-10-19.2",
    spot: { body: "#5b8def", lunettes: "#8b5cf6" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [], medals: {}, stats: {} },
  };
}

function DEFAULT_PROFILES() { return { charles: buildCharles(), clara: buildClara() }; }
