// ============================================================
//  contenu-clara.js — Matériel de 3e année (Clara)
//  Transcrit à partir du cahier d'étude (orthographe, conjugaison),
//  du cahier de grammaire, des savoirs Tam Tam et des grilles de
//  lecture des nombres. Corrige ici si une coquille s'est glissée.
// ============================================================

// ---------- Mots courants (page 1 du cahier d'étude) ----------
const C3_MOTS_COURANTS = ["autre", "avec", "beaucoup", "comme", "dans", "en", "faire", "il est", "j'ai", "je suis", "mais", "plein", "plus", "sans", "toujours"];

// ---------- Listes de vocabulaire (cahier d'étude) ----------
// key : numéro de la liste    regle : ce que Spot rappelle    mots : à mémoriser
const C3_LISTES = [
  { key: "1.1", titre: "Le fromage", regle: "Si j'entends [j] à la fin d'un mot, j'écris toujours « ge ».",
    mots: ["âge", "gorge", "ménage", "nuage", "passage", "village", "voyage"] },
  { key: "1.2", titre: "Le serpent", regle: "Si j'entends [s] au début d'un mot, j'écris le plus souvent « s ».",
    mots: ["saison", "salle", "salut", "sans que", "sapin", "sauver", "sentier", "sentir", "septembre", "soie", "soigner", "soin", "son", "souhaiter", "souper", "souvenir", "souvent", "sujet", "surface"] },
  { key: "1.3", titre: "Le pirate", regle: "Si j'entends [t] à la fin d'un mot, j'écris le plus souvent « te ».",
    mots: ["adulte", "bête", "boîte", "conte", "courte", "date", "droite", "enquête", "faute", "importante", "juste", "minute", "morte", "ouverte", "rate", "sorte", "triste"],
    horsLaLoi: ["botte", "goutte"] },
  { key: "1.4", titre: "La bonne clé", regle: "Si j'entends [k] au début d'un mot, j'écris le plus souvent « c ».",
    mots: ["cacher", "cadeau", "camion", "car", "cause", "clair", "claire", "coin", "combien", "commencer", "comprendre", "compter", "congé", "consoler", "conte", "continuer", "contre", "corps", "costume", "coucher", "couleur", "courant", "courir", "cours", "course", "court", "courte", "crème", "cri", "crier", "crise"],
    horsLaLoi: ["quel", "quelle", "quels", "quelles", "quelqu'un", "quelqu'une", "quelques-uns", "quelques-unes", "question"] },
  { key: "1.5", titre: "La maison de Rosie", regle: "Si j'entends [z] à l'intérieur d'un mot, j'écris le plus souvent « s ».",
    mots: ["amoureuse", "cause", "choisir", "crise", "cuisine", "déposer", "fraise", "magasin", "mauvaise", "museau", "plusieurs", "poser", "présenter", "saison", "télévision", "trésor", "troisième"] },
  { key: "1.6", titre: "Monsieur Champion", regle: "Monsieur Champion transforme le « n » en « m » devant le « b » et le « p ».",
    mots: ["ampoule", "champ", "combien", "comprendre", "compter", "décembre", "exemple", "important", "importante", "jambe", "longtemps", "nombre", "novembre", "ombre", "remplir", "sembler", "septembre"] },
  { key: "2.1", titre: "La lettre crochet", regle: "La lettre crochet attend en silence à la fin d'un mot pour former un mot de même famille.",
    mots: ["alphabet", "argent", "bord", "but", "champ", "chant", "court", "doigt", "dos", "droit", "épais", "fond", "gentil", "haut", "important", "mauvais", "mort", "nid", "ouvert", "part", "point", "pot", "rat", "renard", "retard", "rond", "sabot", "salut", "sourcil"] },
  { key: "2.2", titre: "Le balai magique", regle: "Si j'entends [k] à la fin d'un mot, j'écris le plus souvent « que ».",
    mots: ["dès que", "sans que", "plastique", "presque", "parce que"], horsLaLoi: ["sec", "sèche"] },
  { key: "2.3", titre: "Le magicien Hélas", regle: "Certains mots commencent par un « h » que l'on n'entend pas.",
    mots: ["habiter", "haut", "hauteur", "herbe", "hôpital", "hôpitaux", "horrible", "bonheur", "bonhomme", "dehors", "malheur", "souhaiter"] },
  { key: "2.4", titre: "Histoire de poisson", regle: "Si j'entends [s] à l'intérieur d'un mot, je peux écrire un seul « s » ou deux « s » s'il est placé entre deux voyelles.",
    mots: ["assez", "aussitôt", "bonsoir", "chasse", "chasser", "chasseur", "costume", "danse", "danser", "ensemble", "épaisse", "espérer", "juste", "laisser", "naissance", "ourse", "plastique", "posséder", "possible", "pousser", "poussin", "restaurant", "réussir", "ruisseau", "verger"] },
  { key: "2.5", titre: "Ange ou dragon", regle: "Si j'entends [jon] à la fin d'un mot, j'écris le plus souvent « geon ». Le g est doux devant e, i, y et dur devant a, o, u.",
    mots: ["âge", "argent", "congé", "danger", "diriger", "genou", "genre", "gens", "ménage", "nuage", "protéger", "chagrin", "église", "gagner", "garder", "gauche", "glace", "glisser", "goutte", "groupe", "guerre", "longue", "magasin", "vinaigre"] },
  { key: "2.6", titre: "Cerf ou caméléon", regle: "Si j'entends [ki] et [ke], j'écris le plus souvent « qui » et « que ». Le c est doux devant e, i, y et dur devant a, o, u.",
    mots: ["avancer", "cinéma", "commencer", "décembre", "facile", "lancer", "morceau", "pièce", "précipiter", "recevoir", "service", "chacun", "chacune", "écouter", "écrire", "occuper", "octobre", "parc", "raconter", "rencontrer", "sec", "secouer", "spectacle", "sucre", "manquer", "remarquer"] },
  { key: "3.1", titre: "Les momies", regle: "En général, les noms féminins s'écrivent avec un « e » à la fin.",
    mots: ["année", "demie", "joue", "maladie", "partie", "soie", "soirée", "vue"], horsLaLoi: ["clé", "clef"] },
  { key: "3.2", titre: "La santé", regle: "Si j'entends [té] à la fin d'un nom féminin, j'écris le plus souvent « té ».",
    mots: ["moitié", "santé"] },
  { key: "3.3", titre: "La peur", regle: "Si j'entends [eur] à la fin d'un mot, j'écris presque toujours « eur ».",
    mots: ["bonheur", "chasseur", "chasseuse", "couleur", "docteur", "hauteur", "malheur", "meilleur", "professeur"], horsLaLoi: ["meilleure", "docteure", "professeure"] },
  { key: "3.4", titre: "Un squelette à toute vitesse", regle: "Si j'entends [ès] ou [èt] à la fin d'un nom, j'écris le plus souvent « esse » ou « ette ».",
    mots: ["vitesse", "laisse"] },
  { key: "3.5", titre: "La bonne direction", regle: "Si j'entends [sion] à la fin d'un mot, j'écris presque toujours « tion ».",
    mots: ["attention", "invitation", "réaction"] },
  { key: "3.6", titre: "Lentement mais sûrement", regle: "Si j'entends [man] à la fin d'un mot, j'écris presque toujours « ment ».",
    mots: ["appartement", "lentement", "vêtement"] },
  { key: "4.1", titre: "Voir-venir", regle: "Si j'entends [oir] ou [ir] à la fin d'un verbe, j'écris le plus souvent « oir » et « ir ».",
    mots: ["pleuvoir", "valoir", "choisir", "courir", "découvrir", "mourir", "nourrir", "offrir", "retenir", "revenir", "sentir", "servir"], horsLaLoi: ["boire", "croire", "écrire", "rire"] },
  { key: "4.2", titre: "Personne n'aime trouver un ver dans sa pomme", regle: "« er » au début ou au milieu d'un mot se prononce [èr]. « er » à la fin d'un mot se prononce [é].",
    mots: ["fer", "ferme", "fermer", "herbe", "mer", "perdre", "permettre", "terminer", "terrain", "verre", "verser", "ouvert", "ouverte", "pierre", "rechercher", "traverser", "acheter", "février", "frapper", "jeter", "marcher", "métier", "millier", "montrer", "oublier", "payer", "porter", "préférer", "préparer", "promener", "rappeler", "remonter", "retourner", "retrouver", "réveiller", "rêver", "rouler", "tirer", "toucher", "travailler", "tuer"], horsLaLoi: ["fier", "fière"] },
  { key: "4.3", titre: "All", regle: "Si j'entends [af], [ap], [at] ou [ac] au début d'un mot, je double la consonne.",
    mots: ["affaire", "apporter", "approcher", "attraper"], horsLaLoi: ["après-midi"] },
  { key: "4.4", titre: "Irrillimm", regle: "Si j'entends [ime], [ine] ou [ite] à la fin d'un mot, je ne double pas la consonne. Aide-mémoire : je cuisine des frites sublimes.",
    mots: ["cuisine", "machine", "mine", "suite", "usine", "visite", "voisine", "voisin"] },
  { key: "4.5", titre: "Les mutants", regle: "Si j'entends [an], [ande], [ange] ou [anche], j'écris le plus souvent « an ».",
    mots: ["bande", "changer", "chant", "méchant", "méchante", "tranquille", "vacances", "branche", "demande", "viande"], horsLaLoi: ["champ", "pencher"] },
  { key: "4.6", titre: "Entreprendre", regle: "Si j'entends [an] au début d'un mot, [entre] ou [endre], j'écris le plus souvent « en ».",
    mots: ["enquête", "ensemble", "entrer", "environ", "ventre", "apprendre", "comprendre", "descendre", "rendre", "reprendre"], horsLaLoi: ["ampoule", "embrasser"] },
  { key: "é", titre: "Le son « è »", regle: "Mots avec le son [è] qui s'écrivent « è » ou « ai ».",
    mots: ["crème", "dès que", "lèvre", "lièvre", "lumière", "mètre", "rivière", "sèche", "troisième", "aider", "baigner", "frais", "fraîche", "paraître"] },
  { key: "o", titre: "Le son « o »", regle: "Mots avec le son [o] qui s'écrivent « o », « ô », « au » ou « eau ».",
    mots: ["bientôt", "d'abord", "fou", "folle", "or", "promettre", "téléphone", "trottoir", "aussitôt", "autobus", "agneau", "bateau", "bureau", "château", "photo", "radio"] },
  { key: "B1", titre: "Autres mots, bloc 1", regle: "Mots à mémoriser.",
    mots: ["abri", "allure", "amour", "amoureux", "août", "avaler", "avant-midi", "avion", "avril", "bain", "balle", "ballon", "barbe", "bâton", "battre"] },
  { key: "B2", titre: "Autres mots, bloc 2", regle: "Mots à mémoriser.",
    mots: ["bien", "bonjour", "bouchon", "bouteille", "chiffre", "choix", "dur", "dure", "étoile", "faim", "fil", "film", "fixe", "fleuve", "jeune", "jouet"] },
  { key: "B3", titre: "Autres mots, bloc 3", regle: "Mots à mémoriser.",
    mots: ["juillet", "juin", "lendemain", "libre", "lieu", "ligne", "lion", "lionne", "mai", "mal", "marché", "mars", "mille", "milieu", "million"] },
  { key: "B4", titre: "Autres mots, bloc 4", regle: "Mots à mémoriser.",
    mots: ["minuit", "mois", "moyen", "mur", "murmure", "neuf", "neuve", "nourriture", "ours", "ourse", "pâle", "patin", "pin", "plan", "poids", "poil", "poudre"] },
  { key: "B5", titre: "Autres mots, bloc 5", regle: "Mots à mémoriser.",
    mots: ["prix", "rayon", "rejoindre", "remettre", "repas", "riche", "rien", "taille", "timide", "tour", "trou", "vivre", "voiture", "zoo"] },
  { key: "G", titre: "Mots fréquents (liste de Giasson)", regle: "Les mots qui composent la moitié des textes en français.",
    mots: ["à", "au", "aux", "aller", "autre", "avec", "avoir", "bien", "ce", "cette", "ces", "comme", "de", "du", "des", "dans", "dire", "donner", "elle", "elles", "en", "et", "être", "faire", "il", "ils", "je", "jour", "le", "la", "les", "leur", "leurs", "lui", "mais", "mon", "ma", "mes", "ne", "où", "par", "pas", "plus", "pour", "pouvoir", "prendre", "que", "qui", "se", "sans", "savoir", "si", "soi", "son", "sa", "ses", "sur", "ton", "ta", "tes", "tout", "tous", "un", "une", "venir", "voir", "votre", "vos", "vouloir", "vous"] },
];

// ---------- Conjugaison ----------
const C3_PRONOMS = ["je", "tu", "il", "nous", "vous", "ils"];
const C3_PRONOMS_LABEL = { je: "Je / J'", tu: "Tu", il: "Il / Elle / On", nous: "Nous", vous: "Vous", ils: "Ils / Elles" };
const C3_TEMPS = { present: "Présent", imparfait: "Imparfait", futur: "Futur simple", conditionnel: "Conditionnel présent", futurProche: "Futur proche", participe: "Participe présent" };
// Formes dans l'ordre je, tu, il, nous, vous, ils
const C3_VERBES = {
  aimer: {
    present: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"],
    imparfait: ["aimais", "aimais", "aimait", "aimions", "aimiez", "aimaient"],
    futur: ["aimerai", "aimeras", "aimera", "aimerons", "aimerez", "aimeront"],
    conditionnel: ["aimerais", "aimerais", "aimerait", "aimerions", "aimeriez", "aimeraient"],
    futurProche: ["vais aimer", "vas aimer", "va aimer", "allons aimer", "allez aimer", "vont aimer"],
    participe: "aimant",
  },
  finir: {
    present: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
    imparfait: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
    futur: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
    conditionnel: ["finirais", "finirais", "finirait", "finirions", "finiriez", "finiraient"],
    futurProche: ["vais finir", "vas finir", "va finir", "allons finir", "allez finir", "vont finir"],
    participe: "finissant",
  },
  avoir: {
    present: ["ai", "as", "a", "avons", "avez", "ont"],
    imparfait: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
    futur: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
    conditionnel: ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
    futurProche: ["vais avoir", "vas avoir", "va avoir", "allons avoir", "allez avoir", "vont avoir"],
    participe: "ayant",
  },
  être: {
    present: ["suis", "es", "est", "sommes", "êtes", "sont"],
    imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
    futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
    conditionnel: ["serais", "serais", "serait", "serions", "seriez", "seraient"],
    futurProche: ["vais être", "vas être", "va être", "allons être", "allez être", "vont être"],
    participe: "étant",
  },
  aller: {
    present: ["vais", "vas", "va", "allons", "allez", "vont"],
    imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
    futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
    conditionnel: ["irais", "irais", "irait", "irions", "iriez", "iraient"],
    futurProche: ["vais aller", "vas aller", "va aller", "allons aller", "allez aller", "vont aller"],
    participe: "allant",
  },
};

// ---------- Grilles de lecture des nombres (cartable Maison) ----------
const C3_GRILLES_NOMBRES = [
  { page: 1, max: 250 }, { page: 2, max: 500 }, { page: 3, max: 750 }, { page: 4, max: 1000 },
  { page: 5, max: 2000 }, { page: 6, max: 2000 }, { page: 7, max: 5000 }, { page: 8, max: 5000 }, { page: 9, max: 5000 },
  { page: 10, max: 10000 }, { page: 11, max: 10000 }, { page: 12, max: 10000 },
];

// ---------- Quiz de grammaire (cahier de grammaire 3e) ----------
const C3_QUIZ_GRAMMAIRE = [
  { title: "Quiz : le nom commun et le nom propre", subject: "Grammaire", emoji: "🏷️", questions: [
    { q: "Lequel est un nom propre ?", choices: ["chien", "Québec", "voyage"], answer: 1 },
    { q: "Un nom propre commence toujours par…", choices: ["une minuscule", "une majuscule", "un déterminant"], answer: 1 },
    { q: "Lequel est un nom commun ?", choices: ["Montréal", "Rose", "cousin"], answer: 2 },
    { q: "Le nom commun est souvent accompagné d'un…", choices: ["verbe", "déterminant", "pronom"], answer: 1 },
    { q: "Dans « Mon cousin Jérémie habite à Québec », combien y a-t-il de noms propres ?", choices: ["1", "2", "3"], answer: 1 },
  ] },
  { title: "Quiz : le genre et le nombre", subject: "Grammaire", emoji: "👫", questions: [
    { q: "« des volcans » est…", choices: ["masculin pluriel", "féminin pluriel", "masculin singulier"], answer: 0 },
    { q: "« une montagne » est…", choices: ["masculin singulier", "féminin singulier", "féminin pluriel"], answer: 1 },
    { q: "Si je peux dire « un » ou « le » devant le nom, il est…", choices: ["féminin", "masculin", "pluriel"], answer: 1 },
    { q: "« les fleurs » est…", choices: ["féminin pluriel", "masculin pluriel", "féminin singulier"], answer: 0 },
    { q: "Quel mot n'est pas du même genre que les autres ?", choices: ["la fille", "cette maison", "un garçon"], answer: 2 },
  ] },
  { title: "Quiz : le déterminant", subject: "Grammaire", emoji: "🔖", questions: [
    { q: "Le déterminant est placé…", choices: ["après le nom", "avant le nom", "après le verbe"], answer: 1 },
    { q: "Lequel est un déterminant féminin singulier ?", choices: ["cette", "mes", "cet"], answer: 0 },
    { q: "Lequel est un déterminant masculin pluriel ?", choices: ["ma", "ces", "un"], answer: 1 },
    { q: "Dans « Les gros ballons roulent », le déterminant est…", choices: ["gros", "Les", "roulent"], answer: 1 },
    { q: "Le déterminant reçoit le genre et le nombre du…", choices: ["verbe", "nom", "pronom"], answer: 1 },
  ] },
  { title: "Quiz : le groupe du nom", subject: "Grammaire", emoji: "🧩", questions: [
    { q: "Dans un groupe du nom, le mot obligatoire est…", choices: ["l'adjectif", "le nom", "le déterminant"], answer: 1 },
    { q: "« le garçon » est construit comme…", choices: ["dét. + nom", "dét. + nom + adj.", "nom propre"], answer: 0 },
    { q: "« les gros ballons » est construit comme…", choices: ["dét. + nom + adj.", "dét. + adj. + nom", "dét. + nom + de + GN"], answer: 1 },
    { q: "« une grange à foin » est construit comme…", choices: ["dét. + nom + à + GN", "dét. + adj. + nom", "nom propre"], answer: 0 },
    { q: "Dans « mon perroquet coloré », l'adjectif est…", choices: ["mon", "perroquet", "coloré"], answer: 2 },
    { q: "L'expansion du groupe du nom est…", choices: ["obligatoire", "facultative", "toujours un verbe"], answer: 1 },
  ] },
  { title: "Quiz : l'adjectif", subject: "Grammaire", emoji: "🎨", questions: [
    { q: "L'adjectif décrit…", choices: ["une action", "comment est une personne ou une chose", "le temps"], answer: 1 },
    { q: "Pour savoir si un mot est un adjectif, j'ajoute… devant.", choices: ["très", "ne … pas", "le"], answer: 0 },
    { q: "Dans « Les petits singes mangent », l'adjectif est…", choices: ["singes", "petits", "mangent"], answer: 1 },
    { q: "« Les fusées blanches » : l'adjectif est…", choices: ["masculin pluriel", "féminin pluriel", "féminin singulier"], answer: 1 },
    { q: "L'adjectif est un…", choices: ["donneur d'accord", "receveur d'accord", "verbe"], answer: 1 },
  ] },
  { title: "Quiz : le verbe et le sujet", subject: "Grammaire", emoji: "🏃", questions: [
    { q: "Pour trouver le verbe conjugué, je l'encadre par…", choices: ["très … très", "ne … pas", "le … la"], answer: 1 },
    { q: "Dans « L'ours hiberne dans sa grotte », le verbe est…", choices: ["ours", "hiberne", "grotte"], answer: 1 },
    { q: "Le sujet est souvent placé…", choices: ["après le verbe", "avant le verbe", "à la fin"], answer: 1 },
    { q: "Pour trouver le sujet, je l'encadre par…", choices: ["c'est … qui", "ne … pas", "très … très"], answer: 0 },
    { q: "Dans « Les voitures roulent vite », le sujet est…", choices: ["roulent", "vite", "Les voitures"], answer: 2 },
  ] },
  { title: "Quiz : le pronom", subject: "Grammaire", emoji: "👤", questions: [
    { q: "Le pronom de la 1re personne du singulier est…", choices: ["tu", "je", "nous"], answer: 1 },
    { q: "« Les nains de jardin » se remplace par…", choices: ["il", "elles", "ils"], answer: 2 },
    { q: "« Mon enseignante » se remplace par…", choices: ["elle", "il", "vous"], answer: 0 },
    { q: "« Mes amis et moi » se remplace par…", choices: ["vous", "ils", "nous"], answer: 2 },
    { q: "La 2e personne du pluriel est…", choices: ["vous", "tu", "elles"], answer: 0 },
  ] },
  { title: "Quiz : la phrase", subject: "Grammaire", emoji: "✒️", questions: [
    { q: "Une phrase commence par une majuscule et finit par…", choices: ["une virgule", "un point", "un espace"], answer: 1 },
    { q: "Une question se termine par…", choices: ["?", "!", "."], answer: 0 },
    { q: "« Quelle surprise pour ma fête ! » exprime…", choices: ["une question", "une émotion", "une négation"], answer: 1 },
    { q: "Les mots de négation sont…", choices: ["très … très", "ne … pas", "c'est … qui"], answer: 1 },
    { q: "« Je ne vais jamais en camping » est une phrase…", choices: ["positive", "négative", "interrogative"], answer: 1 },
  ] },
  { title: "Quiz : l'apostrophe et la virgule", subject: "Grammaire", emoji: "💬", questions: [
    { q: "On met une apostrophe quand le mot suivant commence par…", choices: ["une consonne", "une voyelle ou un h muet", "une majuscule"], answer: 1 },
    { q: "Lequel est correct ?", choices: ["le arbre", "l'arbre", "la arbre"], answer: 1 },
    { q: "La virgule sépare les mots d'une…", choices: ["énumération", "question", "négation"], answer: 0 },
    { q: "Entre les deux derniers mots d'une énumération, on écrit…", choices: ["une virgule", "« et » ou « ou »", "un point"], answer: 1 },
  ] },
  { title: "Quiz : le féminin et le pluriel", subject: "Grammaire", emoji: "🔁", questions: [
    { q: "Le féminin de « un ami » est…", choices: ["une amie", "une amis", "une amise"], answer: 0 },
    { q: "Le féminin de « le chanteur » est…", choices: ["la chanteure", "la chanteuse", "la chantrice"], answer: 1 },
    { q: "Le pluriel de « un hibou » est…", choices: ["des hibous", "des hiboux", "des hibouxs"], answer: 1 },
    { q: "Le pluriel de « un journal » est…", choices: ["des journals", "des journaux", "des journales"], answer: 1 },
    { q: "Le pluriel de « un pneu » est…", choices: ["des pneux", "des pneus", "des pneu"], answer: 1 },
    { q: "Le féminin de « le facteur » est…", choices: ["la factrice", "la facteuse", "la facteure"], answer: 0 },
  ] },
  { title: "Quiz : les synonymes", subject: "Grammaire", emoji: "🔄", questions: [
    { q: "Quel mot n'est pas un synonyme des autres ?", choices: ["belle", "horrible", "magnifique"], answer: 1 },
    { q: "Un synonyme de « fort » est…", choices: ["costaud", "faible", "mou"], answer: 0 },
    { q: "Un synonyme de « admirer » est…", choices: ["ignorer", "regarder", "oublier"], answer: 1 },
    { q: "Un synonyme de « drôle » est…", choices: ["amusant", "triste", "sérieux"], answer: 0 },
    { q: "Un synonyme de « maison » est…", choices: ["jardin", "demeure", "voiture"], answer: 1 },
  ] },
];

// ---------- Quiz de maths (savoirs Tam Tam) ----------
const C3_QUIZ_MATHS = [
  { title: "Quiz : la valeur de position", subject: "Maths", emoji: "🔢", questions: [
    { q: "Dans 1246, le chiffre 2 est à la position des…", choices: ["unités", "dizaines", "centaines"], answer: 2 },
    { q: "Dans 1026, le chiffre 2 vaut…", choices: ["2", "20", "200"], answer: 1 },
    { q: "Dans 2134, le chiffre 2 vaut…", choices: ["200", "2000", "20"], answer: 1 },
    { q: "Combien y a-t-il de dizaines dans 1234 ?", choices: ["3", "23", "123"], answer: 2 },
    { q: "273 = 200 + 70 + 3, c'est une…", choices: ["comparaison", "décomposition", "soustraction"], answer: 1 },
  ] },
  { title: "Quiz : les figures et les angles", subject: "Maths", emoji: "📐", questions: [
    { q: "Une figure qui se plie en 2 parties identiques a un…", choices: ["axe de symétrie", "angle droit", "périmètre"], answer: 0 },
    { q: "Une frise est une bande qui contient une…", choices: ["régularité", "fraction", "division"], answer: 0 },
    { q: "Un angle plus petit qu'un angle droit est…", choices: ["obtus", "aigu", "plat"], answer: 1 },
    { q: "Des droites qui ne se rencontrent jamais sont…", choices: ["perpendiculaires", "parallèles", "courbes"], answer: 1 },
    { q: "Un quadrilatère est un polygone à…", choices: ["3 côtés", "4 côtés", "5 côtés"], answer: 1 },
    { q: "Le périmètre, c'est…", choices: ["la longueur du contour", "la surface", "le volume"], answer: 0 },
  ] },
  { title: "Quiz : les opérations", subject: "Maths", emoji: "➕", questions: [
    { q: "Dans 6 + 7 = 13, les nombres 6 et 7 sont les…", choices: ["termes", "facteurs", "produits"], answer: 0 },
    { q: "Dans 3 × 6 = 18, le résultat s'appelle…", choices: ["la somme", "le produit", "le quotient"], answer: 1 },
    { q: "Dans 18 ÷ 3 = 6, le résultat s'appelle…", choices: ["le quotient", "la différence", "le produit"], answer: 0 },
    { q: "La soustraction est l'opération inverse de…", choices: ["la multiplication", "l'addition", "la division"], answer: 1 },
    { q: "Si 7 + 6 = 13, alors 6 + 7 = ?", choices: ["13", "12", "14"], answer: 0 },
    { q: "Pour trouver le terme manquant dans 58 + ? = 72, je fais…", choices: ["58 + 72", "72 − 58", "72 × 58"], answer: 1 },
  ] },
  { title: "Quiz : fractions et nombres décimaux", subject: "Maths", emoji: "🍕", questions: [
    { q: "Dans la fraction 1/4, le 4 est le…", choices: ["numérateur", "dénominateur", "quotient"], answer: 1 },
    { q: "Une pizza coupée en 2 parts égales : chaque part est…", choices: ["un quart", "une demie", "un tiers"], answer: 1 },
    { q: "1/4 et 2/4 : laquelle est la plus grande ?", choices: ["1/4", "2/4", "elles sont égales"], answer: 1 },
    { q: "Dans 3,11, le chiffre après la virgule représente les…", choices: ["dizaines", "dixièmes", "unités"], answer: 1 },
    { q: "Une pièce de 10 ¢ vaut…", choices: ["0,10 $", "1,00 $", "0,01 $"], answer: 0 },
  ] },
  { title: "Quiz : mesure et temps", subject: "Maths", emoji: "📏", questions: [
    { q: "1 mètre = ?", choices: ["10 cm", "100 cm", "1000 cm"], answer: 1 },
    { q: "Une coccinelle se mesure en…", choices: ["m", "cm", "mm"], answer: 2 },
    { q: "1 heure = ?", choices: ["60 secondes", "60 minutes", "24 minutes"], answer: 1 },
    { q: "1 semaine = ?", choices: ["5 jours", "7 jours", "30 jours"], answer: 1 },
    { q: "La petite aiguille de l'horloge indique…", choices: ["les heures", "les minutes", "les secondes"], answer: 0 },
    { q: "1 année = ?", choices: ["10 mois", "12 mois", "52 jours"], answer: 1 },
  ] },
  { title: "Quiz : pair, impair, premier", subject: "Maths", emoji: "🎲", questions: [
    { q: "Un nombre pair se termine par…", choices: ["1, 3, 5, 7, 9", "0, 2, 4, 6, 8", "5 seulement"], answer: 1 },
    { q: "21 est un nombre…", choices: ["pair", "impair"], answer: 1 },
    { q: "7 est un nombre…", choices: ["composé", "premier"], answer: 1 },
    { q: "9 est un nombre…", choices: ["composé", "premier"], answer: 0 },
    { q: "Arrondir 583 à la dizaine près donne…", choices: ["580", "590", "600"], answer: 0 },
    { q: "Arrondir 1234 à la centaine près donne…", choices: ["1200", "1300", "1000"], answer: 0 },
  ] },
  { title: "Quiz : tableau, diagramme et probabilité", subject: "Maths", emoji: "📊", questions: [
    { q: "Un diagramme à bandes présente les données…", choices: ["de façon visuelle", "en mots", "en fractions"], answer: 0 },
    { q: "Tirer une bille rouge d'un sac de billes vertes est…", choices: ["certain", "possible", "impossible"], answer: 2 },
    { q: "3 animaux et 4 sortes de noix : combien de combinaisons ?", choices: ["7", "12", "34"], answer: 1 },
    { q: "15 + 10 et 5 × 5 sont des expressions…", choices: ["équivalentes", "différentes", "impossibles"], answer: 0 },
    { q: "Une suite 15, 25, 35, 45 a une régularité de…", choices: ["+ 5", "+ 10", "× 2"], answer: 1 },
  ] },
];
