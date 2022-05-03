/**
 * Protocol and game variables.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */
class Protocol {
	static START = "[start] ";
	static AVATAR = "[avatar] "
	static MESSAGE = "[message] ";
	static EXPRESSION = "[expression] ";
	static OFFLINE_PLAYER = "[offline player] ";
}

// Game variables
let expressionsList = EXPRESSION_LIST;
let minSips = 1;
let maxSips = 3;
let sipsGiven = 0;
let count = 0;
let players = [];

/**
 * Handles the game according to the data received.
 * This is the state machine.
 *
 * @param data the data received.
 */
function stateMachine(data) {
	if(data.message.startsWith(Protocol.START)) {
		if(document.querySelector('#waitingRoom.show') !== null) {
			document.querySelector('#waitingRoom').remove();
			document.querySelector('body').classList.remove('waitingRoom');
			document.querySelector('body').classList.remove('no-scroll');
		}
		maxSips = data.message.replace(Protocol.START, "");
		maxSips = parseInt(maxSips, 10);
		let str = "Il y aura " + maxSips + " gorgées au maximum en jeu !";
		pickExpression();
		if(maxSips === 1) {
			str = str.replace("gorgées", "gorgée");
		}
		alert(str);
	} else if(data.message.startsWith(Protocol.AVATAR)) {
		let code = data.message.replace(Protocol.AVATAR, ""), peer=data.peer;
		setTimeout(function () {
			avatars[peer].avatar.set_data_avatar(code);
		}, 50);
	} else if(data.message.startsWith(Protocol.EXPRESSION)) {
		let expression = data.message.split("|")[1];
		sipsGiven += parseInt(data.message.split("|")[2], 10);
		count += 1;
		if(count % 30 === 0) {
			alert(count + " expressions lues et " + sipsGiven + " gorgées ont été données !");
		}
		document.getElementById("pick_expression").innerHTML = expression;
		// Removing expression for everyone
		let realExpression = data.message.replace(Protocol.EXPRESSION, "").split("|")[0];
		if(expressionsList.includes(realExpression)) {
			expressionsList = arrayRemove(expressionsList, realExpression);
		}
	} else if(data.message.startsWith(Protocol.OFFLINE_PLAYER)) {
		let value = data.message.replace(Protocol.OFFLINE_PLAYER,"");
		players.push(value);
		document.querySelector("#members-zone").innerHTML +=
			"<li class=\"member\" id=\"TVW1\">" +
				"<div id=\"memberAvatar\">" +
					"<div class=\"avatar\" data-id=" + value + "(hors ligne) data-f=\"3\" data-hf=\"1\" data-h=\"3\">" +
						"<div class=\"avatar-face\" data-state=\"0\">" +
							"<span class=\"avatar-face-eyes\"></span><span class=\"avatar-face-mouth\"></span>" +
						"</div>" +
						"<span class=\"avatar-back-hair a-hair-color\"></span>" +
						"<span class=\"avatar-hair a-hair-color\"></span>" +
						"<div class=\"avatar-accessory\">" +
							"<div class=\"avatar-hat\"></div>" +
							"<div class=\"avatar-glass\"></div>" +
						"</div>" +
					"</div>" +
				"</div>" +
				"<div id=\"memberName\">" + value + " (hors ligne)</div>" +
			"</li>";
	} else if(data.message.startsWith(Protocol.MESSAGE)) {
		postMessage(data.peer,data.message.replace(Protocol.MESSAGE, ""));
	}
}

/**
 * Starts the game.
 */
function startGame() {
	maxSips = prompt("Entrez le nombre de gorgées max", "3");
	if (maxSips == null || maxSips === "") {
		maxSips = 3;
	}
	try {
		maxSips = parseInt(maxSips, 10);
	} catch(error) {
		console.error(error);
		maxSips = 3;
	}
	if(maxSips >= 1) {
		multiplayer.sendMsg(Protocol.START + maxSips, true);
	} else {
		alert("Veuiller entrer un nombre valide !");
	}
}

/**
 * Adds an offline player.
 */
function addOfflinePlayer() {
	let name = prompt("Entrez le prénom du joueur");
	name = name.replace(" ", "_");
	if (name == null || name === "") {
		name = getRandomName();
	}
	multiplayer.sendMsg(Protocol.OFFLINE_PLAYER + name, true);
}

/**
 * Pick and send a random expression.
 */
function pickExpression() {
	if (expressionsList.length > 0) {
		let randomSips = getRandomInt(minSips, maxSips + 1);
		let allPlayers = [];
		for (let member of members) {
			allPlayers.push(member.alias);
		}
		for (let player of players) {
			allPlayers.push(player);
		}
		let randomPlayer = allPlayers[getRandomInt(0, allPlayers.length)];
		let randomExpressionNumber = getRandomInt(0, expressionsList.length);
		let randomInt = getRandomInt(0, 2);
		let expression = expressionsList[randomExpressionNumber];
		let realExpression = expression;
		if (randomInt === 0) {
			expression = expression.replace("Je n'ai jamais", "tu as déjà");
			expression = expression.replace("Je ne me suis jamais", "tu t'es déja");
			expression = expression.replace("Je ne suis jamais", "tu es déja");
			expression = ", bois " + randomSips + " gorgées si " + expression;
			expression = expression.replace(" eu de ", " eu des ").replace(" eu d'", " eu des ");
			expression = expression.replace(" de films ", " des films");
			expression += "<br /><br /> Sinon, donne les !";
		} else {
			expression = expression.replace("Je n'ai jamais", "tu n'as jamais");
			expression = expression.replace("Je ne me suis jamais", "tu ne t'es jamais");
			expression = expression.replace("Je ne suis jamais", "tu n'es jamais");
			expression = ", bois " + randomSips + " gorgées si " + expression;
			expression += "<br /><br /> Sinon, donne les !";
		}
		expression = expression.replace(" mon ", " ton ").replace(" ma ", " ta ").replace(" mes ", " tes ").replace(" nos ", " vos ").replace(" m'", " t'");
		expression = expression.replace(" je ", " tu ").replace(" mon/ma ", " ton/ta ");
		expression = expression.replace(" j'", " tu ").replace(" me ", " te ").replace(" moi ", " toi ").replace(" moi.", " toi.").replace(" me ", " te ");
		expression = expression.replace(" je me suis ", " tu t'es ");
		if (randomSips === 1) {
			expression = expression.replace("gorgées", "gorgée").replace("les !", "la !");
		}
		multiplayer.sendMsg(Protocol.EXPRESSION + realExpression + "|" + randomPlayer + expression + "|" + randomSips, true);
	} else {
		alert("Plus d'expressions !");
	}
}
