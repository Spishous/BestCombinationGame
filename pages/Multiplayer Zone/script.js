/**
 * Protocol and game variables.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */
class Protocol {
	static START = "[start] ";
	static AVATAR = "[avatar] ";
	static END = "[end] ";
	static MESSAGE = "[message] ";
}

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
	} else if(data.message.startsWith(Protocol.AVATAR)) {
		let code = data.message.replace(Protocol.AVATAR, ""), peer=data.peer;
		setTimeout(function () {
			avatars[peer].avatar.set_data_avatar(code);
		}, 50);
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
	multiplayer.sendMsg(Protocol.START, true);
}
