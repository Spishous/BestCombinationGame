/**
 * Util functions.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */

/**
 * Returns a random name composed of one adjective and one noun separated by '_'.
 *
 * @returns {string} the random name returned.
 */
function getRandomName() {
	const adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
	const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
	return (
		adjs[Math.floor(Math.random() * adjs.length)] +
		"_" +
		nouns[Math.floor(Math.random() * nouns.length)]
	);
}

/**
 * Returns a random color.
 *
 * @returns {string} the random color returned.
 */
function getRandomColor() {
	return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

/**
 * Gets random integer between min and max.
 *
 * @param min the minimum.
 * @param max the maximum
 * @returns {number} the number between min and max.
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Opens a box dialog and asks for the player name.
 *
 * @returns {string} the name chosen.
 */
function getName() {
	var name = prompt("Entrez votre prénom");
	name = name.replace(" ", "_");
	if (name == null || name == "") {
		name = getRandomName();
	}
	return name;
}

/**
 * Removes value from array.
 *
 * @param arr the array.
 * @param value the value to remove.
 * @returns {*} the nex array.
 */
function arrayRemove(arr, value) { 
	return arr.filter(function(ele) { return ele != value; });
} 

/**
 * Returns the number of string in the array.
 *
 * @param char the character in the array.
 * @param array the array.
 * @returns {number} the number of characters in the array.
 */
function getCount(char, array) {
	var count = 0;
	for(var i = 0; i < array.length; ++i) {
		if(array[i] == char) {
			count++;
		}
	}
	return count;
}

/**
 * Returns the elements and their occurences.
 *
 * @param arr the array.
 * @returns {*[][]} the tabs with the elements and the occurences.
 */
function elementCounter(arr) {
    var a = [], b = [], prev;
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    return [a, b];
}

/**
 * Returns the sum from 1 to value.
 */
function sum(n) {
	return n * (n + 1) / 2;
}