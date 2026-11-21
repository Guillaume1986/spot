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
//  CHARLES — 1re année (plan d'étude semaine 12, 23 novembre)
//  Dimanche : tout le plan (pages des cahiers comprises).
//  Lundi à vendredi : petits livres + révisions.
// ------------------------------------------------------------
function buildCharles() {
  const LIVRES = { type: "lecture", subject: "Français", emoji: "📗", title: "Petits livres (reliure verte)",
    instructions: "Je lis, avec l'aide de mon parent, les petits livres qui sont dans mon sac de lecture. Mon parent signe la section « Signatures » de ma reliure verte.", minutes: 10 };
  const TEMPETE = { type: "tempete", subject: "Français", emoji: "🌪️", title: "Tempête de sons", rose: TEMPETE_DEFAUT.rose, bleu: TEMPETE_DEFAUT.bleu, jaune: TEMPETE_DEFAUT.jaune };
  const GRILLE49 = { type: "grille", subject: "Maths", emoji: "🔢", title: "Les nombres de 0 à 49 : les 5 premières rangées de la grille (cahier blanc p. 2)", max: 49, count: 8 };
  const SOLIDES = Object.assign({ type: "quiz" }, copy(QUIZ_SOLIDES_FACES));
  const SON_EN = { type: "son", subject: "Français", emoji: "🔊", title: "Le son en", son: "en" };
  const SON_T = { type: "son", subject: "Français", emoji: "🔊", title: "Le son t", son: "t" };
  const CALLI_K = { type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre k (page 19)", lettre: "k" };
  const CALLI_Q = { type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre q (page 20)", lettre: "q" };
  // Pas de mots-étiquettes dans ce plan ; on garde une petite révision le mardi
  const ETIQ_TOUS = { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Tous mes mots-étiquettes (12 mots, surtout ceux à pratiquer)",
    groupe: "A à H", words: Object.values(ETIQUETTES).flat(), count: 12 };
  const REV_SOLIDES = { title: "Révision : les solides et leurs faces" };

  const plan = {
    lundi: [T(copy(LIVRES)), T(rev(SON_EN)), T(rev(TEMPETE)), T(rev(GRILLE49))],
    mardi: [T(copy(LIVRES)), T(rev(SON_T)), T(rev(SOLIDES, REV_SOLIDES)), T(copy(ETIQ_TOUS))],
    mercredi: [T(copy(LIVRES)), T(rev(TEMPETE)), T(rev(SON_EN)), T(rev(GRILLE49))],
    jeudi: [T(copy(LIVRES)), T(rev(SON_T)), T(rev(SOLIDES, REV_SOLIDES))],
    vendredi: [T(copy(LIVRES)), T(rev(TEMPETE)),
      T({ type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac pour lundi", instructions: "Je mets dans mon sac mes livres de bibliothèque, mon sac de lecture et ma reliure verte signée, mon cartable Maison et ma boîte à lunch." })],
    samedi: [],
    dimanche: [T(copy(LIVRES)), T(copy(SON_EN)), T(copy(SON_T)), T(copy(TEMPETE)),
      T(copy(CALLI_K)), T(copy(CALLI_Q)), T(copy(SOLIDES)), T(copy(GRILLE49))],
  };
  const library = [
    copy(LIVRES), copy(TEMPETE), copy(GRILLE49), copy(SOLIDES), copy(ETIQ_TOUS),
    Object.assign({ type: "quiz" }, copy(QUIZ_LIGNES_FIGURES)),
    { type: "grille", subject: "Maths", emoji: "🔢", title: "Je reconnais les nombres de 0 à 49 (cahier blanc p. 7)", max: 49, count: 8 },
    { type: "grille", subject: "Maths", emoji: "🔢", title: "Les nombres de 0 à 39 : les 4 premières rangées de la grille (cahier blanc p. 2)", max: 39, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "L'addition (Numérik p. 9)", op: "+", min: 0, max: 5, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➖", title: "La soustraction (Numérik p. 9)", op: "-", min: 0, max: 10, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "👟", title: "Dénombrer avec des groupes de 2 (Numérik p. 9)", op: "groupes2", min: 0, max: 20, count: 8 },
    { type: "grille", subject: "Maths", emoji: "🔢", title: "Les nombres de 0 à 29 : les 3 premières rangées de la grille (cahier blanc p. 2)", max: 29, count: 8 },
    { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Mots-étiquettes G (page 8)", groupe: "G", words: ETIQUETTES.G },
    { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Mots-étiquettes F (page 8)", groupe: "F", words: ETIQUETTES.F },
    { type: "calcul", subject: "Maths", emoji: "⚖️", title: "Les nombres de 0 à 20 : plus petit, plus grand, égal (Numérik p. 8)", op: "comparer", min: 0, max: 20, count: 8 },
    { type: "spatial", subject: "Maths", emoji: "🧭", title: "Les relations spatiales (Numérik p. 23)", count: 6 },
    { type: "grille", subject: "Maths", emoji: "🔢", title: "Grille de nombres 0 à 19 (cahier blanc p. 2)", max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "1 de plus, 1 de moins", op: "plus1", min: 0, max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "2 de plus, 2 de moins", op: "plus2", min: 0, max: 19, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "➕", title: "10 de plus", op: "plus10", min: 0, max: 40, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "👯", title: "Les doubles", op: "doubles", min: 0, max: 10, count: 8 },
    { type: "calcul", subject: "Maths", emoji: "❓", title: "Le terme manquant", op: "manquant", min: 0, max: 10, count: 6 },
    { type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac", instructions: "Reliure verte signée, cartable Maison, boîte à lunch." },
  ].concat(QUIZ_MATHS.map((q) => Object.assign({ type: "quiz" }, q)));

  return {
    id: "charles", name: "Charles", grade: 1, gradeLabel: "1re année", gender: "m", sayName: "Charle", planEdition: "2026-11-23",
    spot: { body: "#5b8def", lunettes: "" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [], medals: {}, stats: {} },
  };
}

// ------------------------------------------------------------
//  CLARA — 3e année (plan d'étude des semaines du 16 au 27 novembre ; ici, la semaine du 23)
//  Dimanche : tout le plan. Lundi à vendredi : lecture + révisions.
//  Version de la semaine du 23 : évaluation de l'étape 1 (Tam Tam p. 7 à 18) mercredi 25.
// ------------------------------------------------------------
function buildClara() {
  const LECTURE = { type: "lecture", subject: "Français", emoji: "📚", title: "Lecture : 15 minutes du livre de mon choix",
    instructions: "Je lis 15 minutes dans le livre de mon choix. Je peux raconter à Spot ou à un parent ce que j'ai lu.", minutes: 15 };
  const voir = (v) => Object.assign(copy(v), { title: v.title + " (voir puis écrire)", mode: "voir" });
  const L16 = C3_LISTES.find((l) => l.key === "1.6");
  const VOCAB = { type: "mots", subject: "Vocabulaire", emoji: "🏆", title: "Liste 1.6 : Monsieur Champion", liste: "1.6", words: L16.mots, mode: "dicter" };
  const AVOIR = { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer AVOIR au présent (cahier d'étude p. 27)", verbe: "avoir", temps: "present" };
  const ETRE = { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer ÊTRE au présent (cahier d'étude p. 27)", verbe: "être", temps: "present" };
  const ADD7 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 7 (Tam Tam p. 59)", op: "+", table: 7, count: 12, chrono: true };
  const ADD8 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 8 (Tam Tam p. 59)", op: "+", table: 8, count: 12, chrono: true };
  const NOMBRES = { type: "nombres", subject: "Maths", emoji: "🔢", title: "Lecture des nombres 0 à 750 (grille 2, page 3)", max: 750, count: 8 };
  const SIGNATURE_NOMBRES = { type: "tache", subject: "Maths", emoji: "✍️", title: "Lire la grille 2 (page 3) à un parent et la faire signer",
    instructions: "Je lis à voix haute les nombres de la grille 2, de 0 à 750 (page 3 du cartable Maison), à un parent, qui signe la page." };
  const GRAMMAIRE = { type: "tache", subject: "Grammaire", emoji: "📖", title: "Lire les pages 14 à 16 du cahier de grammaire", instructions: "Je lis uniquement les pages 14, 15 et 16 de mon cahier de grammaire." };
  const TAMTAM = { type: "tache", subject: "Maths", emoji: "📘", title: "Lire les pages 17 à 19 des savoirs Tam Tam", instructions: "Je lis les pages 17, 18 et 19 de mes savoirs Tam Tam." };
  const quiz = (debut) => Object.assign({ type: "quiz" }, copy(C3_QUIZ_MATHS.find((q) => q.title.startsWith(debut))));
  const CARTESIEN = quiz("Quiz : le plan cartésien");
  const ETAPE1_A = quiz("Quiz : la valeur de position"), ETAPE1_B = quiz("Quiz : les opérations"), ETAPE1_C = quiz("Quiz : les figures");

  // Semaine du 23 : même plan, mais l'évaluation de l'étape 1 (Tam Tam p. 7 à 18) arrive mercredi 25
  const ETAPE1_LIRE = { type: "tache", subject: "Maths", emoji: "📘", title: "Étape 1 : relire les pages 7 à 18 des savoirs Tam Tam",
    instructions: "Mercredi 25 novembre, j'ai une évaluation de maths sur toute l'étape 1. Je relis les pages 7 à 18 de mes savoirs Tam Tam et je montre à un parent ce que je trouve difficile." };
  const eval1 = (q, quand, sujet) => rev(q, { title: `Révision de l'étape 1 : ${sujet} (évaluation ${quand})` });

  const plan = {
    lundi: [T(copy(LECTURE)), T(rev(VOCAB)), T(rev(AVOIR)), T(eval1(ETAPE1_B, "mercredi", "les opérations")),
      T({ type: "calcul", subject: "Maths", emoji: "➕", title: "Révision de l'étape 1 : additions de grands nombres", op: "grands+", min: 100, max: 999, count: 5 })],
    mardi: [T(copy(LECTURE)), T(rev(ETRE)), T(rev(ADD7)), T(eval1(ETAPE1_C, "demain !", "les figures et les angles")),
      T({ type: "calcul", subject: "Maths", emoji: "➖", title: "Révision de l'étape 1 : soustractions de grands nombres", op: "grands-", min: 100, max: 999, count: 5 })],
    mercredi: [T(copy(LECTURE)), T(rev(VOCAB)), T(rev(ADD8)), T(rev(NOMBRES))],
    jeudi: [T(copy(LECTURE)), T(rev(AVOIR)), T(rev(ETRE)), T(rev(ADD7))],
    vendredi: [T(copy(LECTURE)), T(rev(VOCAB)), T(rev(ADD8)), T(rev(NOMBRES))],
    samedi: [],
    dimanche: [T(copy(LECTURE)), T(voir(VOCAB)), T(copy(AVOIR)), T(copy(ETRE)), T(copy(ADD7)), T(copy(ADD8)),
      T(copy(NOMBRES)), T(copy(SIGNATURE_NOMBRES)), T(copy(GRAMMAIRE)), T(copy(TAMTAM)),
      T(copy(ETAPE1_LIRE)), T(eval1(ETAPE1_A, "mercredi", "la valeur de position"))],
  };
  const L14 = C3_LISTES.find((l) => l.key === "1.4");
  const L15 = C3_LISTES.find((l) => l.key === "1.5");
  const library = [
    copy(LECTURE), copy(VOCAB), copy(AVOIR), copy(ETRE), copy(ADD7), copy(ADD8), copy(NOMBRES), copy(ETAPE1_C),
    { type: "mots", subject: "Vocabulaire", emoji: "🏠", title: "Liste 1.5 : La maison de Rosie", liste: "1.5", words: L15.mots, mode: "dicter" },
    { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer AIMER au présent (cahier d'étude p. 26)", verbe: "aimer", temps: "present" },
    { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer FINIR au présent (cahier d'étude p. 27)", verbe: "finir", temps: "present" },
    { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 6 (Tam Tam p. 59)", op: "+", table: 6, count: 12, chrono: true },
    { type: "mots", subject: "Vocabulaire", emoji: "🔑", title: "Liste 1.4 : La bonne clé (12 mots au hasard)", liste: "1.4", words: L14.mots.concat(L14.horsLaLoi), mode: "dicter", count: 12 },
    { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 4 (Tam Tam p. 59)", op: "+", table: 4, count: 12, chrono: true },
    { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 5 (Tam Tam p. 59)", op: "+", table: 5, count: 12, chrono: true },
    { type: "nombres", subject: "Maths", emoji: "🔢", title: "Lecture des nombres 0 à 500 (grille 2, page 2)", max: 500, count: 8 },
    { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 3 (Tam Tam p. 59)", op: "+", table: 3, count: 12, chrono: true },
    { type: "tables", subject: "Maths", emoji: "➖", title: "Soustractions du 3 (Tam Tam p. 59)", op: "-", table: 3, count: 12, chrono: true },
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
    id: "clara", name: "Clara", grade: 3, gradeLabel: "3e année", gender: "f", planEdition: "2026-11-23",
    spot: { body: "#5b8def", lunettes: "#8b5cf6" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [], medals: {}, stats: {} },
  };
}

function DEFAULT_PROFILES() { return { charles: buildCharles(), clara: buildClara() }; }
