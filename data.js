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
//  CHARLES — 1re année (plan d'étude semaine 10, 9 novembre)
//  Dimanche : tout le plan (pages des cahiers comprises).
//  Lundi à vendredi : petits livres + révisions.
// ------------------------------------------------------------
function buildCharles() {
  const LIVRES = { type: "lecture", subject: "Français", emoji: "📗", title: "Petits livres (reliure verte)",
    instructions: "Je lis, avec l'aide de mon parent, les petits livres qui sont dans mon sac de lecture. Mon parent signe la section « Signatures » de ma reliure verte.", minutes: 10 };
  const TEMPETE = { type: "tempete", subject: "Français", emoji: "🌪️", title: "Tempête de sons", rose: TEMPETE_DEFAUT.rose, bleu: TEMPETE_DEFAUT.bleu, jaune: TEMPETE_DEFAUT.jaune };
  // « Je révise tous les mots-étiquettes appris » : 12 mots par séance, en priorité ceux qu'il ne reconnaît pas encore
  const ETIQ_TOUS = { type: "etiquettes", subject: "Français", emoji: "🏷️", title: "Tous mes mots-étiquettes (12 mots, surtout ceux à pratiquer)",
    groupe: "A à H", words: Object.values(ETIQUETTES).flat(), count: 12 };
  const GRILLE39 = { type: "grille", subject: "Maths", emoji: "🔢", title: "Les nombres de 0 à 39 : les 4 premières rangées de la grille (cahier blanc p. 2)", max: 39, count: 8 };
  const ADDITION = { type: "calcul", subject: "Maths", emoji: "➕", title: "L'addition (Numérik p. 9)", op: "+", min: 0, max: 5, count: 8 };
  const SOUSTRACTION = { type: "calcul", subject: "Maths", emoji: "➖", title: "La soustraction (Numérik p. 9)", op: "-", min: 0, max: 10, count: 8 };
  const SON_P = { type: "son", subject: "Français", emoji: "🔊", title: "Le son p", son: "p" };
  const SON_ON = { type: "son", subject: "Français", emoji: "🔊", title: "Le son on", son: "on" };
  const CALLI_B = { type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre b (page 15)", lettre: "b" };
  const CALLI_D = { type: "calligraphie", subject: "Français", emoji: "✍️", title: "Calligraphie : la lettre d (page 16)", lettre: "d" };
  const BOITE = { type: "tache", subject: "Premier devoir", emoji: "🧰", title: "Ma boîte aux trésors est prête pour demain",
    instructions: "Demain lundi, j'apporte ma boîte aux trésors à l'école avec ses 5 objets à l'intérieur. Je vérifie avec mon parent qu'il ne manque rien et je la mets près de mon sac." };

  const plan = {
    lundi: [T(copy(LIVRES)), T(rev(SON_P)), T(rev(ETIQ_TOUS)), T(rev(ADDITION))],
    mardi: [T(copy(LIVRES)), T(rev(TEMPETE)), T(rev(SON_ON)), T(rev(GRILLE39))],
    mercredi: [T(copy(LIVRES)), T(rev(ETIQ_TOUS)), T(rev(SOUSTRACTION)), T(rev(SON_P))],
    jeudi: [T(copy(LIVRES)), T(rev(TEMPETE)), T(rev(SON_ON)), T(rev(ADDITION))],
    vendredi: [T(copy(LIVRES)), T(rev(ETIQ_TOUS)),
      T({ type: "tache", subject: "Organisation", emoji: "🎒", title: "Préparer mon sac pour lundi", instructions: "Je mets dans mon sac mes livres de bibliothèque, mon sac de lecture et ma reliure verte signée, mon cartable Maison et ma boîte à lunch." })],
    samedi: [],
    dimanche: [T(copy(LIVRES)), T(copy(SON_P)), T(copy(SON_ON)), T(copy(TEMPETE)), T(copy(ETIQ_TOUS)),
      T(copy(CALLI_B)), T(copy(CALLI_D)), T(copy(ADDITION)), T(copy(SOUSTRACTION)), T(copy(GRILLE39)), T(copy(BOITE))],
  };
  const library = [
    copy(LIVRES), copy(TEMPETE), copy(GRILLE39), copy(ETIQ_TOUS), copy(ADDITION), copy(SOUSTRACTION),
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
    id: "charles", name: "Charles", grade: 1, gradeLabel: "1re année", gender: "m", sayName: "Charle", planEdition: "2026-11-09",
    spot: { body: "#5b8def", lunettes: "" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [], medals: {}, stats: {} },
  };
}

// ------------------------------------------------------------
//  CLARA — 3e année (plan d'étude des semaines du 3 au 14 novembre ; ici, la semaine du 9)
//  Dimanche : tout le plan. Lundi à vendredi : lecture + révisions.
// ------------------------------------------------------------
function buildClara() {
  const LECTURE = { type: "lecture", subject: "Français", emoji: "📚", title: "Lecture : 15 minutes du livre de mon choix",
    instructions: "Je lis 15 minutes dans le livre de mon choix. Je peux raconter à Spot ou à un parent ce que j'ai lu.", minutes: 15 };
  const LECTURE_EVAL = Object.assign(copy(LECTURE), { title: "Lecture : 15 minutes (évaluation de lecture demain !)",
    instructions: "Demain, mercredi 11 novembre, j'ai une évaluation de lecture. Je lis 15 minutes, puis je raconte l'histoire à un parent : les personnages, le problème et la fin." });
  const voir = (v) => Object.assign(copy(v), { title: v.title + " (voir puis écrire)", mode: "voir" });
  const L15 = C3_LISTES.find((l) => l.key === "1.5");
  const VOCAB = { type: "mots", subject: "Vocabulaire", emoji: "🏠", title: "Liste 1.5 : La maison de Rosie", liste: "1.5", words: L15.mots, mode: "dicter" };
  const AIMER = { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer AIMER au présent (cahier d'étude p. 26)", verbe: "aimer", temps: "present" };
  const FINIR = { type: "conjug", subject: "Conjugaison", emoji: "🔤", title: "Conjuguer FINIR au présent (cahier d'étude p. 27)", verbe: "finir", temps: "present" };
  const ADD6 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 6 (Tam Tam p. 59)", op: "+", table: 6, count: 12, chrono: true };
  const ADD7 = { type: "tables", subject: "Maths", emoji: "➕", title: "Additions du 7 (Tam Tam p. 59)", op: "+", table: 7, count: 12, chrono: true };
  const NOMBRES = { type: "nombres", subject: "Maths", emoji: "🔢", title: "Lecture des nombres 0 à 750 (grille 1, page 3)", max: 750, count: 8 };
  const SIGNATURE_NOMBRES = { type: "tache", subject: "Maths", emoji: "✍️", title: "Lire la grille 1 (page 3) à un parent et la faire signer",
    instructions: "Je lis à voix haute les nombres de la grille 1, de 0 à 750 (page 3 du cartable Maison), à un parent, qui signe la page." };
  const GRAMMAIRE = { type: "tache", subject: "Grammaire", emoji: "📖", title: "Révision des pages 14 à 16 du cahier de grammaire", instructions: "Je relis les pages 14, 15 et 16 de mon cahier de grammaire." };
  const TAMTAM = { type: "tache", subject: "Maths", emoji: "📘", title: "Révision des pages 15 à 17 des savoirs Tam Tam", instructions: "Je relis les pages 15, 16 et 17 de mes savoirs Tam Tam." };
  const SCIENCES = { type: "tache", subject: "Sciences", emoji: "🔬", title: "Sciences : la leçon 3", instructions: "Je relis la leçon 3 et j'explique à un parent ce que j'ai retenu. Évaluation la semaine du 16 novembre." };

  const plan = {
    lundi: [T(copy(LECTURE)), T(rev(VOCAB)), T(rev(AIMER)), T(rev(ADD6))],
    mardi: [T(copy(LECTURE_EVAL)), T(rev(FINIR)), T(rev(NOMBRES)), T(rev(ADD7))],
    mercredi: [T(copy(LECTURE)), T(rev(VOCAB)), T(rev(ADD6)),
      T(rev(SCIENCES, { instructions: "Je redis à un parent ce que je retiens de la leçon 3 de sciences." }))],
    jeudi: [T(copy(LECTURE)), T(rev(AIMER)), T(rev(FINIR)), T(rev(NOMBRES)), T(rev(ADD7))],
    vendredi: [T(copy(LECTURE)), T(rev(VOCAB)), T(rev(ADD6)),
      T(rev(SCIENCES, { instructions: "Évaluation de sciences la semaine prochaine : je redis à un parent ce que je retiens de la leçon 3." }))],
    samedi: [],
    dimanche: [T(copy(LECTURE)), T(voir(VOCAB)), T(copy(AIMER)), T(copy(FINIR)), T(copy(ADD6)), T(copy(ADD7)),
      T(copy(NOMBRES)), T(copy(SIGNATURE_NOMBRES)), T(copy(GRAMMAIRE)), T(copy(TAMTAM)), T(copy(SCIENCES)),
      T({ type: "tache", subject: "Organisation", emoji: "✍️", title: "Correction et signature du bingo d'Halloween", instructions: "Je corrige mon bingo d'Halloween du 30 octobre et je le fais signer par un parent." })],
  };
  const L14 = C3_LISTES.find((l) => l.key === "1.4");
  const library = [
    copy(LECTURE), copy(VOCAB), copy(AIMER), copy(FINIR), copy(ADD6), copy(ADD7), copy(NOMBRES),
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
    id: "clara", name: "Clara", grade: 3, gradeLabel: "3e année", gender: "f", planEdition: "2026-11-09",
    spot: { body: "#5b8def", lunettes: "#8b5cf6" },
    settings: copy(BASE_SETTINGS), plan, library,
    progress: { points: 0, completed: {}, weekStart: null, history: [], medals: {}, stats: {} },
  };
}

function DEFAULT_PROFILES() { return { charles: buildCharles(), clara: buildClara() }; }
