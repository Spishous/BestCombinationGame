/**
 * Player class.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */
class Player {
	constructor(name) {
		this.name = name;
		this.cards = [];
	}
}

// Game variables
let cards = CARDS;
let turn = 1;
let rank = 1;
let players = [];
let playerTurn = 0;
let pyramid = false;
let pyramidLength = 0;
let maxPyramidLength = prompt("Entrez la valeur du nombre de niveaux de la pyramide (entre 4 et 9)", "5");
maxPyramidLength = parseInt(maxPyramidLength, 10);
if(maxPyramidLength < 4) {
	maxPyramidLength = 4;
}
let cardsUsed = [];

/********** Game functions **********/

/**
 * Adds a player.
 */
function addPlayer() {
	if(players.length < 10) {
		let name = getName();
		players.push(new Player(name));
		if(players.length > 1) {
			document.querySelector("#aside_content h2").innerHTML = "Joueurs (" + players.length + ")";
		} else {
			document.querySelector("#aside_content h2").innerHTML = "Joueur (" + players.length + ")";
		}
		let elt = document.createElement("button");
		elt.innerText = name;
		elt.setAttribute("id", name);
		elt.setAttribute("class", "player");
		elt.setAttribute("onclick", "seePlayerCards(this.id)");
		document.getElementById("players").appendChild(elt);
		let value = 52 - players.length * 4;
		pyramidLength = calculatePyramidLength(value);
		if(pyramidLength >= maxPyramidLength) {
			pyramidLength = maxPyramidLength;
		} else {
			alert("Il y a " + players.length + " joueur[s], la pyramide aura " + pyramidLength + " étages au maximum et non " + maxPyramidLength + " !");
		}
	} else {
		alert("Le nombre maximal de joueurs a été atteint !");
	}
}

/**
 * Picks a random card.
 *
 * @returns {string|Card} the random card.
 */
function pickCard() {
	if(cards.length > 0) {
		let randomIndex = getRandomInt(0, cards.length);
		let randomCard = new Card(cards[randomIndex].number, cards[randomIndex].symbol, cards[randomIndex].description, cards[randomIndex].image);
		document.getElementById("pick_card").innerHTML = '<img src="./assets/cards_images/' + randomCard.image + '" alt="' + randomCard.description + '"/>';
		cards.splice(randomIndex, 1);
		if(pyramid) {
			cardsUsed.push(randomCard);
			seeCardsUsed();
			document.getElementById("next_player").disabled = false;
			playerTurn += 1;
			if(playerTurn === players.length && !pyramid) {
				playerTurn = 0;
				turn += 1;
			}
		}
		if(!pyramid) {
			players[playerTurn].cards.push(randomCard);
		}
		return randomCard;
	} else {
		let returnString = "Plus de carte !";
		alert(returnString);
		return returnString;
	}
}

/**
 * Allows to see the player cards.
 *
 * @param id the player ID.
 */
function seePlayerCards(id) {
	let index = 0;
	let value = "";
	for(let i = 0; i < players.length; i++) {
		if(players[i].name === id) {
			index = i;
		}
	}
	for(let card of players[index].cards) {
		value += card.description + "\n";
	}
	if(value !== "") {
		alert("Les cartes de " + players[index].name + " sont : \n\n" + value);
	} else {
		alert(players[index].name + " n'a pas encore de cartes !");
	}
}

/**
 * Calculates the number of levels for the pyramid.
 */
function calculatePyramidLength(remainingCards) {
	let n = 0;
	while(sum(n) <= remainingCards) {
		n +=1;
	}
	return n - 1;
}

/**
 * Tests is someone lies.
 */
function liar() {
	let value = prompt("Entrez le nom de celui qui ment", "");
	let boolean = false;
	let isPlayer = false;
	let index = 0;
	for (let i = 0; i < players.length; i++) {
		if (players[i].name === value) {
			index = i;
			isPlayer = true;
		}
	}
	for(let card of players[index].cards) {
		if(card.image.substr(0, 1) === document.querySelector("img").src.substr(-6).substr(0, 1)) {
			boolean = true;
		}
	}
	let str;
	if(boolean && isPlayer) {
		str = value + " possède la carte, ce n'est pas un menteur !";
	} else if(!boolean && isPlayer) {
		str = value + " ne possède pas la carte, c'est un menteur !";
	} else {
		str = "Veuillez entrer un joueur valide !";
	}
	alert(str);
}

/**
 * Called when it's the turn of the next player.
 */
function nextPlayer() {
	document.getElementById("pyramid_cards").style.display = "none";
	document.getElementById("buttons").style.display = "initial";
	for(let i = 0; i<document.querySelectorAll(".guess").length; i++) {
		document.querySelectorAll(".guess")[i].disabled = false;
	}
	document.getElementById("red").style.display = "none";
	document.getElementById("black").style.display = "none";
	document.getElementById("more").style.display = "none";
	document.getElementById("minus").style.display = "none";
	document.getElementById("external").style.display = "none";
	document.getElementById("internal").style.display = "none";
	document.getElementById("equal").style.display = "none";
	document.getElementById("slade").style.display = "none";
	document.getElementById("diamond").style.display = "none";
	document.getElementById("club").style.display = "none";
	document.getElementById("heart").style.display = "none";
	if(players.length !== 0) {
		document.getElementById("add_player").disabled = true;
		let value = "";
		if(turn === 1) {
			value = players[playerTurn].name + ", " + turn + " gorgée en jeu, carte rouge ou noire ?!";
			document.getElementById("red").style.display = "initial";
			document.getElementById("black").style.display = "initial";
		} else if(turn === 2) {
			value = players[playerTurn].name + ", " + turn + " gorgées en jeu, plus, égal, ou moins que " + players[playerTurn].cards[0].description + " ?!";
			document.getElementById("more").style.display = "initial";
			document.getElementById("minus").style.display = "initial";
			document.getElementById("equal").style.display = "initial";
		} else if(turn === 3) {
			value = players[playerTurn].name + ", " + turn + " gorgées en jeu, interne à " + players[playerTurn].cards[0].description + " et " + players[playerTurn].cards[1].description +  " , externe ou poteau ?!";
			document.getElementById("external").style.display = "initial";
			document.getElementById("internal").style.display = "initial";
			document.getElementById("equal").style.display = "initial";
			document.getElementById("equal").innerHTML = "Poteau";
		} else if(turn === 4) {
			value = players[playerTurn].name + ", " + turn + " gorgées en jeu, quel symbole ?!";
			document.getElementById("slade").style.display = "initial";
			document.getElementById("diamond").style.display = "initial";
			document.getElementById("club").style.display = "initial";
			document.getElementById("heart").style.display = "initial";
		} else {
			pyramid = true;
			document.getElementById("liar").style.visibility = "visible";
			document.getElementById("pyramid_cards").style.display = "initial";
			document.getElementById("buttons").style.display = "none";
			if(pyramidLength >= 3) {
				if(playerTurn === pyramidLength - sum(0)) {
					rank += 1;
				} else if(playerTurn === pyramidLength * 2 - sum(1)) {
					rank += 1;
				} else if(playerTurn === pyramidLength * 3 - sum(2)) {
					rank += 1;
				} else if(playerTurn === pyramidLength * 4 - sum(3)) {
					rank += 1
				} else if(playerTurn === pyramidLength * 5 - sum(4)) {
					rank += 1;
				} else if(playerTurn === pyramidLength * 6 - sum(5)) {
					rank += 1;
				} else if(playerTurn === pyramidLength * 7 - sum(6)) {
					rank += 1;
				} else if(playerTurn === pyramidLength * 8 - sum(7)) {
					rank += 1;
				}
				document.querySelector("h1").innerHTML = "Pyramide (rangée " + rank + " / " + pyramidLength + ")";
				if(rank === pyramidLength) {
					document.getElementById("next_player").disabled = true;
					alert("Dernier étage, c'est cul sec direct !");
				}
				if(rank === 1) {
					value = rank + " gorgée en jeu, qui a cette carte ?!";
				} else {
					value = rank + " gorgées en jeu, qui a cette carte ?!";
				}
			} else {
				alert("Pyramide trop petite !");
			}
		}
		document.getElementById("info").innerHTML = value;
		document.getElementById("next_player").innerHTML = "Suivant";
		if(pyramid) {
			pickCard();
			document.getElementById("pick_card").disabled = true;
			document.getElementById("next_player").disabled = false;
		} else {
			document.getElementById("pick_card").innerHTML = '<img src="./assets/cards_images/gray_back.png" alt="Back of the card"/>';
			document.getElementById("pick_card").disabled = false;
			document.getElementById("next_player").disabled = true;
		}
		if(rank === pyramidLength) {
			document.getElementById("next_player").disabled = true;
		}
	} else {
		alert("Il n'y a pas assez de joueurs !");
	}
}

/**
 * See cards of the pyramid.
 */
function seeCardsUsed() {
	let value = "";
	for(let i = pyramidLength * 8 - sum(7); i < pyramidLength * 9 - sum(8); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n              " + "                                            ";
	for(let i = pyramidLength * 7 - sum(6); i < pyramidLength * 8 - sum(7); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n            " + "                                            ";
	for(let i = pyramidLength * 6 - sum(5); i < pyramidLength * 7 - sum(6); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n          " + "                                            ";
	for(let i = pyramidLength * 5 - sum(4); i < pyramidLength * 6 - sum(5); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n        " + "                                            ";
	for(let i = pyramidLength * 4 - sum(3); i < pyramidLength * 5 - sum(4); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n      " + "                                            ";
	for(let i = pyramidLength * 3 - sum(2); i < pyramidLength * 4 - sum(3); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n    " + "                                            ";
	for(let i = pyramidLength * 2 - sum(1); i < pyramidLength * 3 - sum(2); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n  " + "                                            ";
	for(let i = pyramidLength - sum(0); i < pyramidLength * 2 - sum(1); i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	value += "\n" + "                                            ";
	for(let i = 0; i < pyramidLength; i++) {
		try {
			if(cardsUsed[i].number.length === 1) {
				value += cardsUsed[i].number + "    ";
			} else {
				value += cardsUsed[i].number + "  ";
			}
		} catch (error) {
			console.log(error);
			value += "x  ";
		}
	}
	for(let i = 0; i < 3; i++) {
		value = value.replace("10", "T").replace("11", "J").replace("12", "Q").replace("13", "K");
	}
	document.getElementById("pyramid_cards").innerText = value.replace("\\n", "<br />");
	document.getElementById("pyramid_cards").innerText = document.getElementById("pyramid_cards").innerText.substr(9 - pyramidLength);
}

/**
 * Called when clicking on button to guess the next card.
 *
 * @param id the card ID.
 */
function guess(id) {
	pickCard();
	let cardValue = document.querySelector("img").src.substr(-6).substr(0, 1).replace("0", "10");
	cardValue = parseInt(cardValue.replace("A", "1").replace("J", "11").replace("Q", "12").replace("K", "13"), 10);
	let str = "";
	if(id === "red") {
		let cardColor = document.querySelector("img").src.substr(-5).substr(0, 1);
		if(cardColor === "H" || cardColor === "D") {
			str = "Gagné, tu donnes 1 gorgée !\n" + "C'est une carte rouge !";
		} else {
			str = "Perdu, tu bois 1 gorgée !\n" + "C'est une carte noire !";
		}
	}
	if(id === "black") {
		let cardColor = document.querySelector("img").src.substr(-5).substr(0, 1);
		if(cardColor === "S" || cardColor === "C") {
			str = "Gagné, tu donnes 1 gorgée !\n" + "C'est une carte noire !";
		} else {
			str = "Perdu, tu bois 1 gorgée !\n" + "C'est une carte rouge !";
		}
	}
	if(id === "more") {
		let playerCard1 = players[playerTurn].cards[0].number;
		if(cardValue > playerCard1) {
			str = "Gagné, tu donnes 2 gorgées !\n" + cardValue + " est plus grand que " + playerCard1 + " !";
		} else if(cardValue === playerCard1) {
			str = "Perdu, tu bois 4 gorgées !\n" + cardValue + " est égal à " + playerCard1 + " !";
		} else {
			str = "Perdu, tu bois 2 gorgées !\n" + cardValue + " est plus petit que " + playerCard1 + " !";
		}
	}
	if(id === "minus") {
		let playerCard1 = players[playerTurn].cards[0].number;
		if(cardValue < playerCard1) {
			str = "Gagné, tu donnes 2 gorgées !\n" + cardValue + " est plus petit que " + playerCard1 + " !";
		} else if(cardValue === playerCard1) {
			str = "Perdu, tu bois 4 gorgées !\n" + cardValue + " est égal à " + playerCard1 + " !";
		} else {
			str = "Perdu, tu bois 2 gorgées !\n" + cardValue + " est plus grand que " + playerCard1 + " !";
		}
	}
	if(id === "internal") {
		let playerCard1 = players[playerTurn].cards[0].number;
		let playerCard2 = players[playerTurn].cards[1].number;
		let min = Math.min(playerCard1, playerCard2);
		let max = Math.max(playerCard1, playerCard2);
		if(cardValue > min && cardValue < max) {
			str = "Gagné, tu donnes 3 gorgées !\n" + cardValue + " est interne à " + min + " et " + max + " !";
		} else if(cardValue === min || cardValue === max) {
			str = "Perdu, tu bois 6 gorgées !\n" + cardValue + " est un poteau !";
		} else {
			str = "Perdu, tu bois 3 gorgées !\n" + cardValue + " est externe à " + min + " et " + max + " !";
		}
	}
	if(id === "external") {
		let playerCard1 = players[playerTurn].cards[0].number;
		let playerCard2 = players[playerTurn].cards[1].number;
		let min = Math.min(playerCard1, playerCard2);
		let max = Math.max(playerCard1, playerCard2);
		if(cardValue < min || cardValue > max) {
			str = "Gagné, tu donnes 3 gorgées !\n" + cardValue + " est externe à " + min + " et " + max + " !";
		} else if(cardValue === min || cardValue === max) {
			str = "Perdu, tu bois 6 gorgées !\n" + cardValue + " est un poteau !";
		} else {
			str = "Perdu, tu bois 3 gorgées !\n" + cardValue + " est interne à " + min + " et " + max + " !";
		}
	}
	if(id === "equal") {
		if(turn === 2) {
			let playerCard1 = players[playerTurn].cards[0].number;
			if(cardValue === playerCard1) {
				str = "Gagné, tu donnes 2 gorgées !\n" + "C'est bien " + playerCard1 + " !";
			} else {
				str = "Perdu, tu bois 2 gorgées !\n" + cardValue + " est différent de " + playerCard1 + " !";
			}
		} else if(turn === 3) {
			let playerCard1 = players[playerTurn].cards[0].number;
			let playerCard2 = players[playerTurn].cards[1].number;
			if(cardValue === playerCard1 || cardValue === playerCard2) {
				str = "Gagné, tu donnes 3 gorgées !\n" + cardValue + " est un poteau !";
			} else {
				str = "Perdu, tu bois 3 gorgées !\n" + cardValue + " est différent de " + playerCard1 + " ou de " + playerCard2 + " !";
			}
		}
	}
	if(id === "slade") {
		let cardSymbol = document.querySelector("img").src.substr(-5).substr(0, 1);
		if(cardSymbol === "S") {
			str = "Gagné, tu donnes 4 gorgées !\n" + "C'est un pique !";
		} else {
			str = "Perdu, tu bois 4 gorgées !\n" + "Ce n'est pas un pique !";
		}
	}
	if(id === "diamond") {
		let cardSymbol = document.querySelector("img").src.substr(-5).substr(0, 1);
		if(cardSymbol === "D") {
			str = "Gagné, tu donnes 4 gorgées !\n" + "C'est un carreau !";
		} else {
			str = "Perdu, tu bois 4 gorgées !\n" + "Ce n'est pas un carreau !";
		}
	}
	if(id === "club") {
		let cardSymbol = document.querySelector("img").src.substr(-5).substr(0, 1);
		if(cardSymbol === "C") {
			str = "Gagné, tu donnes 4 gorgées !\n" + "C'est un trèfle !";
		} else {
			str = "Perdu, tu bois 4 gorgées !\n" + "Ce n'est pas un trèfle !";
		}
	}
	if(id === "heart") {
		let cardSymbol = document.querySelector("img").src.substr(-5).substr(0, 1);
		if(cardSymbol === "H") {
			str = "Gagné, tu donnes 4 gorgées !\n" + "C'est un coeur !";
		} else {
			str = "Perdu, tu bois 4 gorgées !\n" + "Ce n'est pas un coeur !";
		}
	}
	for(let i = 0; i<document.querySelectorAll(".guess").length; i++) {
		document.querySelectorAll(".guess")[i].disabled = true;
	}
	document.getElementById("info").innerHTML = str;
	document.getElementById("next_player").disabled = false;
	playerTurn += 1;
	if(playerTurn === players.length && !pyramid) {
		playerTurn = 0;
		turn += 1;
	}
}