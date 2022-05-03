/**
 * Protocol and game variables.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */
class Protocol {
	static START = "[start] ";
	static AVATAR = "[avatar] "
	static END = "[end] ";
	static MESSAGE = "[message] ";
	static BOSS = "[boss] ";
	static CHOICE = "[choice] ";
	static BLACK_CARD = "[blackCard] ";
	static WHITE_CARD = "[whiteCard] ";
}

// Game variables
let blackCardsList = [];
let whiteCardsList = [];
let myScore = 0;
let scoreMax = 5;
let myLastProposition = ""; // used to compare my proposition and the choice made by the boss
let proposition = ""; // used for black cards with multiple white cards choice
let isBoss = false;
let bossName = "";
let cardsPicked = 0;
let timer;
let numberOfAnswerRequired = 0; // an answer for each '_' from black cards

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
		let choice = data.message.replace(Protocol.START, "");
		if(choice === "1") {
			whiteCardsList = WHITE_CARDS_LIST;
			blackCardsList = BLACK_CARDS_LIST;
		} else if(choice === "2") {
			whiteCardsList = WHITE_CARDS_LIST_BLANC_MANGER_COCO;
			blackCardsList = BLACK_CARDS_LIST_BLANC_MANGER_COCO;
		} else {
			whiteCardsList = WHITE_CARDS_LIST.concat(WHITE_CARDS_LIST_BLANC_MANGER_COCO);
			blackCardsList = BLACK_CARDS_LIST.concat(BLACK_CARDS_LIST_BLANC_MANGER_COCO);
		}
		pick();
		setTimeout(function() {
			for(let i = 0; i<document.querySelectorAll(".member").length; i++) {
				if(!document.querySelectorAll(".member")[i].innerHTML.includes("0")) {
					document.querySelectorAll(".member")[i].innerHTML = document.querySelectorAll(".member")[i].innerHTML + " : 0";
				}
			}
		}, 700);
	} else if(data.message.startsWith(Protocol.AVATAR)) {
		let code = data.message.replace(Protocol.AVATAR, ""), peer=data.peer;
		setTimeout(function () {
			avatars[peer].avatar.set_data_avatar(code);
		}, 50);
	} else if(data.message.startsWith(Protocol.BOSS)) {
		isBoss = data.message.replace(Protocol.BOSS, "").split("|")[0] === multiplayer.getMyPeerID();
		if(isBoss) {
			sendBlackCard();
		}
		disableWhiteCards(isBoss);
		let bossID = data.message.replace(Protocol.BOSS, "").split("|")[0];
		bossName = data.message.replace(Protocol.BOSS, "").split("|")[1];
		let bossScore = data.message.replace(Protocol.BOSS, "").split("|")[2];
		//let oldProposition = data.message.replace(Protocol.BOSS, "").split("|")[3];
		document.querySelector("#info").innerHTML = "Boss : " + bossName;
		document.querySelector("#" + bossID + " #memberName").innerHTML = bossName;
		document.querySelector("#" + bossID + " #memberScore").innerHTML = bossScore;
		alert("Le boss est " + bossName + " maintenant !");
	} else if(data.message.startsWith(Protocol.PROPOSITION)) {
		addPropositionToHTML(data.message.replace(Protocol.PROPOSITION, ""));
	} else if(data.message.startsWith(Protocol.CHOICE)) {
		document.getElementById(data.message.replace(Protocol.CHOICE, "")).style.color = "white";
		document.getElementById(data.message.replace(Protocol.CHOICE, "")).style.backgroundColor = "rgb(15, 38, 63)";
		setTimeout(function() {
			if(myLastProposition === data.message.replace(Protocol.CHOICE, "")) {
				myScore += 1;
				if(myScore === scoreMax) {
					multiplayer.sendMsg(Protocol.END + multiplayer.getMyPeerAlias());
				}
				isBoss = true;
				multiplayer.sendMsg(Protocol.BOSS + multiplayer.getMyPeerID() + "|" + multiplayer.getMyPeerAlias() + "|" + myScore + "|" + myLastProposition, true);
			} else {
				isBoss = false;
			}
		}, 3000);
	} else if(data.message.startsWith(Protocol.BLACK_CARD)) {
		numberOfAnswerRequired = getCount("_", data.message);
		document.getElementById("black_card").innerHTML = data.message.replace(Protocol.BLACK_CARD, "");
		document.getElementById("propositions").innerHTML = "";
		// Removing black card for everyone
		if(blackCardsList.includes(data.message.replace(Protocol.BLACK_CARD, ""))) {
			let expressionToRemove = data.message.replace(Protocol.BLACK_CARD, "");
			blackCardsList = arrayRemove(blackCardsList, expressionToRemove);
		}
	} else if(data.message.startsWith(Protocol.WHITE_CARD)) {
		// Removing white card for everyone
		if(whiteCardsList.includes(data.message.replace(Protocol.WHITE_CARD, ""))) {
			let expressionToRemove = data.message.replace(Protocol.WHITE_CARD, "");
			whiteCardsList = arrayRemove(whiteCardsList, expressionToRemove);
		}
	} else if(data.message.startsWith(Protocol.END)) {
		alert("Fin de la partie ! " + data.message.replace(Protocol.END, "") + " a gagné !");
	} else if(data.message.startsWith(Protocol.MESSAGE)) {
		postMessage(data.peer,data.message.replace(Protocol.MESSAGE, ""));
	}
}

/**
 * Starts the game.
 */
function startGame() {
	if(members.length > 2) {
		let choice = prompt("Entrez une liste de cartes :\n1 : Les cartes de moi et mes potes\n2 : Les cartes originales du jeu 'Blanc-manger Coco'\n3 : Les deux");
		let bossID = members[getRandomInt(0, members.length - 1)].peerID;
		bossName = members[getRandomInt(0, members.length - 1)].alias;
		multiplayer.sendMsg(Protocol.START + choice, true);
		multiplayer.sendMsg(Protocol.BOSS + bossID + "|" + bossName + "|" + "0", true);
	} else {
		alert("Vous devez être au moins 3 pour jouer !");
	}
}

/**
 * Disables click on white cards or not.
 *
 * @param disabled the variable used to know if it is disabled or not.
 */
function disableWhiteCards(disabled) {
	for(let i = 0; i<document.querySelectorAll(".white_card").length; i++) {
		document.querySelectorAll(".white_card")[i].disabled = disabled;
	}
}

/**
 * Picks a random white card.
 *
 * @returns {string|*} the random white card.
 */
function pickRandomWhiteCard() {
	if(whiteCardsList.length > 0) {
		let randomIndex = getRandomInt(0, whiteCardsList.length);
		let randomWhiteCard = whiteCardsList[randomIndex];
		whiteCardsList.splice(randomIndex, 1);
		// Removing black car for everyone
		multiplayer.sendMsg(Protocol.WHITE_CARD + randomWhiteCard, true);
		return randomWhiteCard;
	} else {
		return "";
	}
}

/**
 * Picks a random black card.
 *
 * @returns {string|*} the random black card.
 */
function pickRandomBlackCard() {
	if(blackCardsList.length > 0) {
		let randomIndex = getRandomInt(0, blackCardsList.length);
		let randomBlackCard = blackCardsList[randomIndex];
		blackCardsList.splice(randomIndex, 1);
		return randomBlackCard;
	} else {
		let returnString = "Plus de carte noire !";
		alert(returnString);
		return returnString;
	}
}

/**
 * Sends white card to game.
 *
 * @param id the white card id.
 */
function sendWhiteCard(id) {
	if(!isBoss) {
		if(numberOfAnswerRequired > 0) {
			if(numberOfAnswerRequired === 1) {
				proposition += document.getElementById(id).innerHTML;
				multiplayer.sendMsg(Protocol.PROPOSITION + proposition, true);
				myLastProposition = proposition;
				proposition = "";
				disableWhiteCards(true);
			} else {
				proposition = document.getElementById(id).innerHTML + " ; ";
			}
			document.getElementById(id).innerHTML = pickRandomWhiteCard();
			if(document.getElementById(id).innerHTML === "") {
				let element = document.getElementById(id);
				element.remove();
			}
			numberOfAnswerRequired--;
		}
	}
}

/**
 * Sends black card to game.
 */
function sendBlackCard() {
	multiplayer.sendMsg(Protocol.BLACK_CARD + pickRandomBlackCard(), true);
}

/**
 * Selects the proposition.
 *
 * @param id the proposition id.
 */
function selectProposition(id) {
	if(isBoss) {  // not necessary because proposition button shoud be disabled
		if(document.querySelectorAll(".proposition").length < members.length - 1) {
			let missing = members.length - 1 - document.querySelectorAll(".proposition").length;
			if(missing > 1) {
				alert("Il manque " + missing + " propositions !");
			} else {
				alert("Il manque " + missing + " proposition !");
			}
		} else {
			for(let i = 0; i<document.querySelectorAll(".proposition").length; i++) {
				document.querySelectorAll(".proposition")[i].disabled = true;
			}
			multiplayer.sendMsg(Protocol.CHOICE + document.getElementById(id).innerHTML, true);
			isBoss = false;
		}
	}
}

/**
 * Adds proposition to screen.
 *
 * @param proposition the proposition to add.
 */
function addPropositionToHTML(proposition) {
	let propositionElt = '<button class="proposition" id="' + proposition + '" onclick="selectProposition(this.id)">' + proposition + '</button>';
	document.getElementById("propositions").innerHTML += propositionElt;
	document.getElementById(proposition).disabled = !isBoss;
}

/**
 * Picks the right amount of cards.
 */
function pick() {
	timer = setInterval(function() {
		document.querySelectorAll(".white_card")[cardsPicked].innerHTML = pickRandomWhiteCard();
		cardsPicked += 1;
		if(cardsPicked === 7) {
			clearInterval(timer);
		}
	}, 100);
}
