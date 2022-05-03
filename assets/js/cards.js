/**
 * Cards used in games.
 *
 * @author GIRARD Timothée
 * @version 1.0
 * @link https://boardgamegeek.com/wiki/page/standard_deck_playing_card_games
 */
class Card {
	constructor(number, symbol, description, image) {
		this.number = number;
		this.symbol = symbol;
		this.description = description;
		this.image = image;
	}
}

/**
 * All the cards.
 *
 * @type {Card[]} the tab of cards.
 * @link http://acbl.mybigcommerce.com/52-playing-cards/
 */
const CARDS = [
	// spades
	new Card(1, "spade", "As de pique", "1S.png"),
	new Card(2, "spade", "Deux de pique", "2S.png"),
	new Card(3, "spade", "Trois de pique", "3S.png"),
	new Card(4, "spade", "Quatre de pique", "4S.png"),
	new Card(5, "spade", "Cinq de pique", "5S.png"),
	new Card(6, "spade", "Six de pique", "6S.png"),
	new Card(7, "spade", "Sept de pique", "7S.png"),
	new Card(8, "spade", "Huit de pique", "8S.png"),
	new Card(9, "spade", "Neuf de pique", "9S.png"),
	new Card(10, "spade", "Dix de pique", "10S.png"),
	new Card(11, "spade", "Valet de pique", "JS.png"),
	new Card(12, "spade", "Dame de pique", "QS.png"),
	new Card(13, "spade", "Roi de pique", "KS.png"),

	// clubs
	new Card(1, "club", "As de trèfle", "1C.png"),
	new Card(2, "club", "Deux de trèfle", "2C.png"),
	new Card(3, "club", "Trois de trèfle", "3C.png"),
	new Card(4, "club", "Quatre de trèfle", "4C.png"),
	new Card(5, "club", "Cinq de trèfle", "5C.png"),
	new Card(6, "club", "Six de trèfle", "6C.png"),
	new Card(7, "club", "Sept de trèfle", "7C.png"),
	new Card(8, "club", "Huit de trèfle", "8C.png"),
	new Card(9, "club", "Neuf de trèfle", "9C.png"),
	new Card(10, "club", "Dix de trèfle", "10C.png"),
	new Card(11, "club", "Valet de trèfle", "JC.png"),
	new Card(12, "club", "Dame de trèfle", "QC.png"),
	new Card(13, "club", "Roi de trèfle", "KC.png"),

	// hearts
	new Card(1, "heart", "As de coeur", "1H.png"),
	new Card(2, "heart", "Deux de coeur", "2H.png"),
	new Card(3, "heart", "Trois de coeur", "3H.png"),
	new Card(4, "heart", "Quatre de coeur", "4H.png"),
	new Card(5, "heart", "Cinq de coeur", "5H.png"),
	new Card(6, "heart", "Six de coeur", "6H.png"),
	new Card(7, "heart", "Sept de coeur", "7H.png"),
	new Card(8, "heart", "Huit de coeur", "8H.png"),
	new Card(9, "heart", "Neuf de coeur", "9H.png"),
	new Card(10, "heart", "Dix de coeur", "10H.png"),
	new Card(11, "heart", "Valet de coeur", "JH.png"),
	new Card(12, "heart", "Dame de coeur", "QH.png"),
	new Card(13, "heart", "Roi de coeur", "KH.png"),

	// diamonds
	new Card(1, "diamond", "As de carreau", "1D.png"),
	new Card(2, "diamond", "Deux de carreau", "2D.png"),
	new Card(3, "diamond", "Trois de carreau", "3D.png"),
	new Card(4, "diamond", "Quatre de carreau", "4D.png"),
	new Card(5, "diamond", "Cinq de carreau", "5D.png"),
	new Card(6, "diamond", "Six de carreau", "6D.png"),
	new Card(7, "diamond", "Sept de carreau", "7D.png"),
	new Card(8, "diamond", "Huit de carreau", "8D.png"),
	new Card(9, "diamond", "Neuf de carreau", "9D.png"),
	new Card(10, "diamond", "Dix de carreau", "10D.png"),
	new Card(11, "diamond", "Valet de carreau", "JD.png"),
	new Card(12, "diamond", "Dame de carreau", "QD.png"),
	new Card(13, "diamond", "Roi de carreau", "KD.png"),
];