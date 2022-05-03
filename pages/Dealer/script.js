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
let dealer = "";
let dealerCount = 0;
let players = [];
let playerTurn = 0;
let playerTry = 1;
let cardToGuess;
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
		let elt = document.createElement("p");
		elt.innerText = name;
		elt.setAttribute("id", name);
		elt.setAttribute("class", "player");
		document.getElementById("players").appendChild(elt);
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
		cards.splice(randomIndex, 1);
		cardsUsed.push(randomCard.number);
		playerTurn += 1;
		if(playerTurn === players.length) {
			playerTurn = 0;
		}
		return randomCard;
	} else {
		let returnString = "Fin de la partie !";
		document.getElementById("next_player").disabled = true;
		alert(returnString);
		return returnString;
	}
}

/**
 * Called when clicking on button to guess the next card/
 *
 * @param id the card ID.
 */
function guess(id) {
	let str = "";
	let sips = 0;
	let value = parseInt(id, 10);
	if(playerTry === 1) {
		if(cardToGuess.number === value) {
			str = "Gagné, tu fais boire deux gorgées au dealer !";
			dealerCount = 0;
			document.getElementById("pick_card").innerHTML = '<img src="./assets/cards_images/' + cardToGuess.image + '" alt="' + cardToGuess.description + '"/>';
			document.getElementById("next_player").disabled = false;
			for(let i = 0; i<document.querySelectorAll(".guess").length; i++) {
				document.querySelectorAll(".guess")[i].disabled = true;
			}
		} else if(cardToGuess.number > value){
			str = "C'est plus que " + value + " !";
			playerTry = 2;
			for(let i = 0; i<value; i++) {
				document.querySelectorAll(".guess")[i].disabled = true;
			}
		} else {
			str = "C'est moins que " + value + " !";
			playerTry = 2;
			for(let i = value - 1; i<document.querySelectorAll(".guess").length; i++) {
				document.querySelectorAll(".guess")[i].disabled = true;
			}
		}
	} else if(playerTry === 2) {
		if(cardToGuess.number === value) {
			str = "Gagné, tu fais boire une gorgée au dealer !";
			dealerCount = 0;
		} else {
			sips = Math.abs(cardToGuess.number - value);
			if(sips > 1) {
				str = "Perdu, tu bois " + sips + " gorgées !";
			} else {
				str = "Perdu, tu bois " + sips + " gorgée !";
			}
			dealerCount += 1;
		}
		document.getElementById("pick_card").innerHTML = '<img src="./assets/cards_images/' + cardToGuess.image + '" alt="' + cardToGuess.description + '"/>';
		document.getElementById("next_player").disabled = false;
		for(let i = 0; i<document.querySelectorAll(".guess").length; i++) {
			document.querySelectorAll(".guess")[i].disabled = true;
		}
		playerTry = 1;
	}
	document.getElementById("info").innerHTML = str;
	if(dealerCount === 3) {
		//alert(dealer.name + " a fait boire 3 joueurs, il passe le paquet à " + players[playerTurn].name + ", c'est maintenant lui le dealer !");
		dealerCount = 0;
		players.push(dealer);	// add the old dealer
		dealer = players[playerTurn];
		players.splice(playerTurn, 1);	// remove the new dealer
	}
	document.querySelector("h1").innerHTML = "Dealer : " + dealer.name + " (" + dealerCount + "/3)";
}

/**
 * Called when it's the turn of the next player.
 */
function nextPlayer() {
	if(players.length !== 0) {
		if(document.getElementById("next_player").innerHTML !== "Suivant") {
			let randomInt = getRandomInt(0, players.length);
			dealer = players[randomInt];
			alert("Le dealer est " + dealer.name + " !");
			document.querySelector("h1").innerHTML = "Dealer : " + dealer.name + " (" + dealerCount + "/3)";
			players.splice(randomInt, 1);
		}
		seeCardsUsed();
		for(let i = 0; i<document.querySelectorAll(".guess").length; i++) {
			document.querySelectorAll(".guess")[i].disabled = false;
		}
		cardToGuess = pickCard();
		document.getElementById("next_player").innerHTML = "Suivant";
		document.getElementById("pick_card").innerHTML = '<img src="./assets/cards_images/gray_back.png" alt="Back of the card"/>';
		document.getElementById("pick_card").disabled = false;
		document.getElementById("next_player").disabled = true;
		document.getElementById("info").innerHTML = players[playerTurn].name + ", devine quelle est la carte !";
	} else {
		alert("Il n'y a pas assez de joueurs !");
	}
}

/**
 * Display cards used to screen.
 */
function seeCardsUsed() {
	document.getElementById("cards_used").innerHTML = "";
	let lists = elementCounter(cardsUsed);
	for(let i = 0; i<lists[0].length; i++) {
		let elt = document.createElement("p");
		let figure = lists[0][i] + "";
		figure = figure.replace("11", "J").replace("12", "Q").replace("13", "K");
		elt.innerHTML = figure + "<br />(" + lists[1][i] + ")";
		elt.setAttribute("class", "card");
		document.getElementById("cards_used").appendChild(elt);
		if(lists[1][i] === 1) {
			elt.style.color = "green";
		} else if(lists[1][i] === 2) {
			elt.style.color = "orange";
		} else if(lists[1][i] === 3) {
			elt.style.color = "red";
		} else if(lists[1][i] === 4) {
			elt.style.backgroundColor = "grey";
		}
	}
}