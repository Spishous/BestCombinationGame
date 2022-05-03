/**
 * Multiplayer game functions.
 *
 * @author GIRARD Timothée
 * @version 1.0
 */

/********** Variables **********/

/**
 * The player name.
 *
 * @type {string}
 */
let playerName = "";

/**
 * The tab of members.
 *
 * @type {*[]}
 */
let members = [];

/**
 * The tab of avatars.
 *
 * @type {*[]}
 */
let avatars = [];

/**
 * The variable handling the reconnexion.
 */
let reconnexion;

/**
 * The multiplayer object.
 *
 * @type {Multiplayer}
 */
let multiplayer = new Multiplayer();

/********** Practical functions **********/

/**
 * Handles widow closing.
 */
window.addEventListener("beforeunload", function (e) {
    let message = "Êtes-vous sûr(e) de vouloir quitter la partie ?";
    e.returnValue = message; // Provoque une demande de confirmation (standard)
    return message; // Provoque une demande de confirmation (certains navigateurs)
});

/**
 * Allows to change the room title.
 *
 * @param host the boolean used to know if it is the host or not.
 */
function changeRoomTitle(host=false) {
    let lockRoom = (localStorage.getItem("instance").endsWith('_private'))?'<i class="fas fa-lock" style="margin-right:10px;font-size:.9em"></i>':'';
    if(host) {
        document.querySelector('#waitingRoom h1').innerHTML=lockRoom+"Room (host)";
    } else {
        document.querySelector('#waitingRoom h1').innerHTML=lockRoom+"Room";
    }
}

/**
 * On visibility change.
 */
document.onvisibilitychange = () => {
    if(document.visibilityState === 'visible') {// && !multiplayer.wss.params.isconnected) {
        setTimeout(function() {
            if(multiplayer.wss.readyState===multiplayer.wss.CLOSED){
                multiplayer.init();
                try {multiplayer.onDisconnected({})} catch (e) {}
            }
        },200);
    }
}

/********** Members handling **********/

/**
 * Creates the member element.
 *
 * @param member the member to create.
 * @returns {HTMLDivElement} the HTML div element.
 */
function createMemberElement(member) {
    const name = member.alias;
    const el = document.createElement('li');
    let html = '<div id="memberAvatar"><div class="avatar" data-id="PID' + member.peerID + '"></div></div>' +
                '<div id="memberName">' + name + '</div>';
    if(typeof myScore !== "undefined") {
        html += '<div id="memberScore">' + myScore + '</div>'
    }
    el.innerHTML = html
    el.className = 'member';
    el.id = member.peerID; // added to handle scores display
    setTimeout(function () {
        let avatar=new Avatar(document.querySelector(".avatar[data-id=PID"+member.peerID+"]"));
        avatars[member.peerID] = {"avatar":avatar};
    }, 50);
    return el;
}

/**
 * Updates members.
 */
function updateMembers() {
    members = [];
    let a = multiplayer.getPeerList();
    a.forEach(element => { members.push(element) });
    if(document.querySelector('#waitingRoom.show') !== null) {
        document.querySelector('#waitingRoom #playerCount').innerText=members.length;//+"/?";
        document.querySelector('.list-player ul').innerHTML="";
        avatars=[];
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
        document.querySelector('#members-zone').appendChild(createMemberElement(member))
    );
    setTimeout(function () {
        multiplayer.sendMsg(Protocol.AVATAR + localStorage.getItem('avatar-data'), true);
    },100);
}

/********** Multiplayer functions **********/

/**
 * Connection to the server.
 */
multiplayer.connect("wss://bestcombinationgame.alwaysdata.net/wss");

/**
 * On connected.
 */
multiplayer.onConnected = () => {
    saveLog();
    clearInterval(reconnexion);
    playerName = localStorage.getItem("username");
    multiplayer.log(playerName);
}

/**
 * On logged.
 */
multiplayer.onLogged = () => {
    multiplayer.joinRoom(localStorage.getItem("room"), localStorage.getItem("instance"));
    playerName = multiplayer.getMyPeerAlias();
}

/**
 * On peer connected.
 */
multiplayer.onPeerConnected = () => {
    updateMembers();
}

/**
 * On kicked.
 */
multiplayer.onKicked=multiplayer.onDisconnected = (e) => {
    if(document.querySelector('#waitingRoom.show') !== null) {
        console.log(e.length);
        if(e.length) {
            switch (e.signal) {
                case 'room-close':
                    document.querySelector('#waitingRoom .list-player').innerHTML='<div>Room fermée par l\'hôte</div>';
                    break;
                default:
                    document.querySelector('#waitingRoom .list-player').innerHTML='<div>Room fermée</div>';
                    break;
            }
        } else {
            document.querySelector('#waitingRoom .list-player').innerHTML='<div>Connexion perdue</div>';
        }
    }
    updateMembers();
}

/**
 * On joined room.
 */
multiplayer.onJoinedRoom = (e) => {
    updateMembers();
    if(e.isHost) {
        changeRoomTitle(true);
        document.querySelector('#btnStartGame').style.display="";
    } else {
        changeRoomTitle();
        document.querySelector('#btnStartGame').remove();
    }
}

/**
 * On peer left.
 */
multiplayer.onLeftRoom = () => {
    updateMembers();
}

/**
 * On peer disconnected.
 */
multiplayer.onPeerDisconnected = () => {
    updateMembers();
}

/**
 * On disconnected.
 */
multiplayer.onDisconnected = () => {
    reconnexion=setInterval(function() {
        if(!multiplayer.isConnected()) {
            multiplayer.reconnect();
        } else {
            clearInterval(reconnexion);
        }
        aab.innerHTML=multiplayer.isConnected() + " " + Date();
    },100);
}

/**
 * On message.
 *
 * @param data the data received.
 */
multiplayer.onMessage = (data) => {
    stateMachine(data);
}

/**
 * Allows to save log.
 */
function saveLog(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/statistique/savelog", true);
    // Envoie les informations du header adaptées avec la requête
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("name="+localStorage.getItem('username'));
}
