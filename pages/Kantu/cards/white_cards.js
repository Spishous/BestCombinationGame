/**
 * List of caption cards, each line must be into " " and finish by ','.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */

/**
 * 150 caption cards.
 *
 * @type {string[]} the tab of white cards.
 */
const WHITE_CARDS_LIST = [
"Quand le verre que tu viens de boire n'est pas bien passé",
"Quand tes potes te victimisent quand tu es bourré",
"Quand tes potes te victimisent quand tu dors",
"Quand elle te termine à la bouche",
"Quand même quand tu dors, tu fais des trucs incroyables",
"Quand tu es teubé",
"Quand tu as froid aux pieds",
"Quand tu es fracasss",
"Quand tes fringues sont morts",
"Quand tu as trop mangé",
"Quand tu es alcoolique",
"Quand tu dis que tu ne vas prendre qu'un verre",
"Quand tu te dis que tes potes sont cons",
"Quand tu n'aimes pas du tout",
"Quand tu as des envies suicidaires",
"Quand tu vas niquer des mères",
"Quand on t'a tué à la muscu",
"Quand tu as le bide à bières",
"Quand tu es en PLS",
"Quand tu es heureux(euse)",
"Quand tu en con, mais c'est pas grave",
"Quand tu bois le verre de trop",
"Quand tu es un guerrier",
"Quand on t'écrit dessus",
"Quand c'est la fin des partiels",
"Quand tu es fatigué(e)",
"Quand tu es BG",
"Quand tu penses à ton avenir incertain",
"Quand tu aimes la bassine",
"Quand tu es musclé(e)",
"Quand tu as une position bizarre",
"Quand tu fais une photo de profil",
"Quand tu doutes",
"Quand tu sais pas où dormir",
"Quand tu es pas content",
"Quand tu chies",
"Quand tu aimes la bière",
"Quand tu ne comprends pas ce qu'il se passe",
"Quand tu vas ken ce soir",
"Quand tu es mort",
"Quand tu n'atteins même pas la bassine",
"Quand tu aimes ton pays",
"Quand tu aimes le soplard",
"Quand tu dis bonjour",
"Quand tu as une tête de gland",
"Quand tu as un regard vicieux",
"Quand tu te chies dessus",
"Quand tu es content de ton coup",
"Quand tu félicites ton pote",
"Quand tu sais pas danser",
"Really Nigga ?!",
"Quand tu peux boire en toute circonstance",
"Quand tu n'as un corps de lâche",
"Quand tu es en position caca",
"Quand l'alcool a pris le dessus",
"Quand tu n'as pas de couverture",
"Quand tu vas bientôt le/la quitter",
'Quand tu cauchemardes',
"Quand la photo est aussi floue que ta soirée",
"Quand tu sais pas porter de soutif",
"Quand tes lunettes sont moches",
"Quand tu es généreux(euse)",
"Quand tu téléphones",
"Quand on t'a tué",
"Quand tu sais pas cuisiner",
"Quand y'a trop d'alcool",
"Quand tu es hypnotisé(e)",
"Quand tu n'as pas de pudeur",
"Quand tu t'amuses même avec un rien",
"Quand tu aimes les pâtes",
"Quand tu es alcoolique",
"Quand tu arrêtes de fumer",
"Quand tu sais pas quoi faire",
"Quand on t'annonce soirée ce soir",
"Quand tu découvres ton découvert",
"Oh DAAAMN ce petit bon petit boule",
"Quand tu n'es pas serein",
"Quand tu bois le verre de trop",
"Quand tu es sur le point de jouir",
"Quand tu avales",
"Quand tu es vraiment trop moche",
"Quand y'a de la petite qui squate",
"Quand tu es cocu(e)",
"Quand tu as pris une olive",
"Quand tu te prends une faciale",
"Quand tu as trop longtemps sucé",
"Quand on t'apprend une mauvaise nouvelle",
"WTF ?!",
"Mais d'où ?!",
"Quand on te dit : 'Dernière tournée !'",
"Quand tu n'es enfin plus célibataire",
"Quand tu as les couilles qui rayent le parquet",
"Quand tu es milliardaire",
"Quand tu es maladroit(e)",
"Quand enfin tu peux pisser",
"Quand Mamadou toque à la frontière",
"Quand tu sais que ça va puer",
"Quand tu décuves",
"Quand tu vois ton ou ta crush se faire draguer",
"Quand tu joui(e)s",
"Quand tu simules",
"Quand on t'apprend que tu as un cancer",
"Quand on t'apprend que tu as un gosse",
"Quand tu perds 7/0 à FIFA",
"Quand tu rages quit",
"Quand tu es vraiment pas doué(e)",
"Quand tu vomis tes trippes",
"Quand tu es sur le point de vomir",
"RIP everyone",
"Quand tu essaies de rester naturel(le)",
"Quand tu te demandes le sens de la vie",
"Quand ça fait le cinquième cheat meal de la semaine",
"Quand tu es en dépression",
"Quand tu apprends que ton ou ta crush est gay ou lesbienne",
"Quand tu te fait larguer par texto",
"Pourquoi ?!",
"Je suis pas bourré... Faux !",
"Quand tu n'assumes pas ta copine",
"Quand tu n'assumes pas tes potes",
"Quand tu n'assumes pas ce que tu as fait",
"Quand tu sais que tu vas niquer le game",
"Quand tu as la mi-molle",
"Trust me, I'm an engineer",
"Quand tu as une révélation",
"Quand tu es un(e) géni(e)",
"Quand tu aurais aimé ne pas être né(e)",
"Quand tu remets ton sous-vêtement sale car tu n'en as plus",
"Quand tu es addict",
"Quand c'est les soldes",
"Quand tu es vénère de ouf",
"Quand tu grailles après un jeune",
"Quand tu gagnes au loto",
"Quand tu te fais tromper",
"Quand tu te fais surprendre par tes parents",
"Quand tu bégayes",
"Quand ta coupe de cheveux est loupée",
"Quand tu veux toujours avoir raison",
"Quand il ne reste plus qu'une bière",
"Quand tous les bars sont fermés",
"Quand on t'offre une tournée au bar",
"Quand on te pose un lapin",
"Quand tu te fais sucer",
"Quand tu chies trop fort",
"Quand tu es SDF",
"Quand tu planes de ouf",
"Quand tu ne comprends même pas ce que tu racontes",
"Quand tu ne comprends pas une blague",
"Quand tu as 1,25/20",
"Quand tu es à 0,01 d'avoir la moyenne",
"Quand tu es chaud(e)"
];

/**
 * x caption cards.
 *
 * @type {*[]} the tab of official caption cards.
 */
const WHITE_CARDS_LIST_KANTU = [
// TODO
];