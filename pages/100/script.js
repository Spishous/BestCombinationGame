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
	static CARD = "[card] ";
	static PROPOSITION = "[proposition] ";
	static COUNT = "[count] ";
	static GIVE_SIPS = "[give sips] ";
}

// Game variables
let cards = CARDS;
let score = 0;
let players = [];
let playerTurn = 0;
let cardsPicked = 0;
let cardsPlayed = 0;
let playerWhoGives = "";
let sipsToGive = 0;
let timer;

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
		document.getElementById("message").innerHTML = "Distribution de " + Math.floor(52 / members.length) + " cartes aux " + members.length + " joueurs...";
		pick();
		let wait = Math.floor(52 / members.length * 100);
		setTimeout(function() {
			document.getElementById("message").innerHTML = "C'est à " + multiplayer.getPeerAlias(players[playerTurn]) + " de jouer !";
			if(multiplayer.getPeerAlias(players[playerTurn]) === multiplayer.getMyPeerAlias()) {
				for(let i = 0; i<document.querySelectorAll(".card").length; i++) {
					document.querySelectorAll(".card")[i].disabled = false;
				}
			} else {
				for(let i = 0; i<document.querySelectorAll(".card").length; i++) {
					document.querySelectorAll(".card")[i].disabled = true;
				}
			}
		}, wait);
	} else if(data.message.startsWith(Protocol.AVATAR)) {
		let code = data.message.replace(Protocol.AVATAR, ""), peer=data.peer;
		setTimeout(function () {
			avatars[peer].avatar.set_data_avatar(code);
		}, 50);
	} else if(data.message.startsWith(Protocol.CARD)) {
		for(let i=0; i<cards.length; i++) {
			if(cards[i].description === data.message.replace(Protocol.CARD, "")) {
				cards.splice(i, 1);
			}
		}
	} else if(data.message.startsWith(Protocol.PROPOSITION)) {
		let txt = data.message.replace(Protocol.PROPOSITION, "").replace("J", "11").replace("Q", "12").replace("K", "13").replace("A", "1");
		if (txt === "13"){
			score = 70;
		} else if (txt === "12"){
			score = 0;
		} else {
			score += parseInt(txt, 10);
		}
		update();
	} else if(data.message.startsWith(Protocol.GIVE_SIPS)) {
		if(sipsToGive > 1) {
			alert(data.message.replace(Protocol.GIVE_SIPS, "") + " a reçu " + sipsToGive + " gorgées par " + playerWhoGives + " !");
		} else {
			alert(data.message.replace(Protocol.GIVE_SIPS, "") + " a reçu " + sipsToGive + " gorgée par " + playerWhoGives + " !");
		}
		playerWhoGives = "";
		nextTurn();
	} else if(data.message.startsWith(Protocol.MESSAGE)) {
		postMessage(data.peer,data.message.replace(Protocol.MESSAGE, ""));
	}
}

/**
 * On peer connected (for the game of 100 only).
 */
multiplayer.onPeerConnected = () => {
	updateMembers100();
}

/**
 * Creates the member element (for the game of 100 only).
 *
 * @param member the member to create.
 * @returns {HTMLDivElement} the HTML div element.
 */
function createMemberElement100(member) {
	const name = member.alias;
	const el = document.createElement('li');
	el.className = 'member';
	el.id = member.peerID; // added to handle scores display
	el.innerHTML = '<div id="memberAvatar"><div class="avatar" data-id="PID' + member.peerID + '"></div></div>' +
					'<button id="memberName" onclick="giveSips(this.parentElement.id)" disabled="true">' + name+ '</button>'
	setTimeout(function () {
		let avatar=new Avatar(document.querySelector(".avatar[data-id=PID"+member.peerID+"]"));
		avatars[member.peerID] = {"avatar":avatar};
	}, 50)
	return el;
}

/**
 * Updates members (for the game of 100 only).
 */
function updateMembers100() {
	members = [];
	let a = multiplayer.getPeerList();
	a.forEach(element => { members.push(element) });
	if(document.querySelector('#waitingRoom.show') !== null) {
		document.querySelector('#waitingRoom #playerCount').innerText=members.length;//+"/?";
		document.querySelector('.list-player ul').innerHTML="";
		members.forEach(member => {
			let attrCurrentPlayer="";
			if(member.peerID===multiplayer.getMyPeerID()) {
				attrCurrentPlayer=' class="currentPlayer"';
			}
			document.querySelector('.list-player ul').innerHTML +="<li"+attrCurrentPlayer+">"+member.alias+"</li>";
		})
	}
	document.querySelector('#members-zone').innerHTML = '<h3 id="player-count">-</h3>';
	if(members.length > 1) {
		document.querySelector('#player-count').innerHTML = `${members.length} joueurs en ligne`;
	} else {
		document.querySelector('#player-count').innerHTML = `${members.length} joueur en ligne`;
	}
	members.forEach(member =>
		document.querySelector('#members-zone').appendChild(createMemberElement100(member))
	);
	setTimeout(function () {
		multiplayer.sendMsg(Protocol.AVATAR + localStorage.getItem('avatar-data'), true);
	},100)
	players = [];
	for(let member of members) {
		players.push(member.peerID);
	}
	players = players.sort();
}

/**
 * Starts the game.
 */
function startGame() {
	if(members.length > 1) {
		multiplayer.sendMsg(Protocol.START, true);
	} else {
		alert("Vous devez être au moins 2 pour jouer !");
	}
}

/**
 * Picks a random card.
 */
function pick() {
	timer = setInterval(function pickRandomCard() {
		if(cards.length > 0) {
			cardsPicked += 1;
			let value = Math.floor(52 / members.length);
			if(cardsPicked === value) {
				clearInterval(timer);
			}
			let randomIndex = getRandomInt(0, cards.length);
			let randomCard = cards[randomIndex];
			cards.splice(randomIndex, 1);
			// To remove card car for everyone
			multiplayer.sendMsg(Protocol.CARD + randomCard.description, true);
			let elt = document.createElement("button");
			elt.setAttribute("class", "card");
			elt.setAttribute("id", randomCard.image);
			elt.setAttribute("disabled", "true");
			elt.setAttribute("onclick", "propose(this.id)");
			elt.innerHTML = '<img src="/assets/cards_images/' + randomCard.image + '" alt="' + randomCard.description + '"/>';
			document.getElementById("player_cards").appendChild(elt);
			return randomCard;
		} else {
			return "";
		}
	}, 100);
}

/**
 * Proposes a card.
 *
 * @param id the player ID.
 */
function propose(id) {
	let value = id.substr(-6).substr(0, 1).replace("0", "10");
	multiplayer.sendMsg(Protocol.PROPOSITION + value, true);
	document.getElementById(id).remove();
	for(let i = 0; i < document.querySelectorAll(".card").length; i++) {
		document.querySelectorAll(".card")[i].disabled = true;
	}
}

/**
 * Gives a sip to player.
 *
 * @param id the player ID.
 */
function giveSips(id) {
	multiplayer.sendMsg(Protocol.GIVE_SIPS + multiplayer.getPeerAlias(id), true);
	for(let i = 0; i<document.querySelectorAll(".member #memberName").length; i++) {
		document.querySelectorAll(".member #memberName")[i].disabled = true;
	}
	closeMenu();
}

/**
 * Opens the menu if not already opened.
 */
function openMenu() {
	if(document.querySelector('.menu-style.menu-hamburger:not(.open)') != null
		&& multiplayer.getPeerAlias(players[playerTurn]) === playerName) {
		document.querySelector('.menu-style.menu-hamburger').click();
	}
}

/**
 * Closes the menu if not already closed.
 */
function closeMenu() {
	if(document.querySelector('.menu-style.menu-hamburger:not(.open)') == null
		&& multiplayer.getPeerAlias(players[playerTurn]) === playerName) {
		document.querySelector('.menu-style.menu-hamburger').click();
	}
}

/**
 * Updates the screen.
 */
function update() {
	let str = "";
	if(score === 10) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 1 gorgée !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 1;
		openMenu();
	} else if(score === 20) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 2 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 2;
		openMenu();
	} else if(score === 30) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 3 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 3;
		openMenu();
	} else if(score === 40) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 4 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 4;
		openMenu();
	} else if(score === 50) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 5 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 5;
		openMenu();
	} else if(score === 60) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 6 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 6;
		openMenu();
	} else if(score === 70) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 7 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 7;
		openMenu();
	} else if(score === 80) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 8 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 8;
		openMenu();
	} else if(score === 90) {
		str = multiplayer.getPeerAlias(players[playerTurn]) + " donne 9 gorgées !";
		playerWhoGives = multiplayer.getPeerAlias(players[playerTurn]);
		sipsToGive = 9;
		openMenu();
	} else if(score >= 100) {
		alert("Cul sec pour " + multiplayer.getPeerAlias(players[playerTurn]) + " !");
		score = 0;
		nextTurn();
	} else {
		nextTurn();
	}
	if(str !== "") {
		document.getElementById("message").innerHTML = str;
		document.getElementById("score").innerHTML = "Score : " + score;
	}
	if(playerWhoGives === playerName) {
		for(let i = 0; i<document.querySelectorAll(".member #memberName").length; i++) {
			document.querySelectorAll(".member #memberName")[i].disabled = false;
		}
		//document.getElementById(multiplayer.getMyPeerID()).disabled = true;
		document.querySelector("#" + multiplayer.getMyPeerID() + " #memberName").disabled = true;
	} else {
		for(let i = 0; i<document.querySelectorAll(".member #memberName").length; i++) {
			document.querySelectorAll(".member #memberName")[i].disabled = true;
		}
	}
}

/**
 * Handles the next turn.
 */
function nextTurn() {
	document.getElementById("score").innerHTML = "Score : " + score;
	playerTurn += 1;
	if(playerTurn === members.length) {
		playerTurn = 0;
	}
	document.getElementById("message").innerHTML = "C'est à " + multiplayer.getPeerAlias(players[playerTurn]) + " de jouer !";
	if(multiplayer.getPeerAlias(players[playerTurn]) === multiplayer.getMyPeerAlias()) {
		for(let i = 0; i<document.querySelectorAll(".card").length; i++) {
			document.querySelectorAll(".card")[i].disabled = false;
		}
	} else {
		for(let i = 0; i<document.querySelectorAll(".card").length; i++) {
			document.querySelectorAll(".card")[i].disabled = true;
		}
	}
	cardsPlayed += 1;
	if(cardsPlayed === Math.floor(52 / members.length) * members.length) {
		alert("Fin de la partie !");
		document.location.reload(true);
	}
	if(members.length === 1) {
		alert("Tous les joueurs sont partis, c'est la fin de la partie !");
		document.location.reload(true);
	}
}
