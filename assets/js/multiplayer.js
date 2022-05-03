class Multiplayer{
    wss;
    /** @Param {} */
    onConnected;
    /** @Param {} */
    onDisconnected;
    /** @Param {signal:"error", details} */
    onError;
    /** @Param {signal:"login-ok", peerID, alias} */
    onLogged;
    /** @Param {} */
    onSendMsg;
    /** @Param {signal:'join-ok', room, instance, isHost: [bool]} */
    onJoinedRoom;
    /** @Param {signal:'left-ok'} */
    onLeftRoom;
    /** when room is closed or kicked from room by host
     * @Param {signal: 'room-close', details} | {signal: 'kicked', details} */
    onKicked;
    /** when a peer join room
     * @Param {signal:'peer-join', peerID, alias} */
    onPeerConnected;
    /** when a peer left room
     * @Param {signal:'peer-left', peerID, alias} */
    onPeerDisconnected;
    /** @Param "{message, peer}" */
    onMessage;

    constructor() {
        this.wss=[];
        this.autoReconnect=false;
        this.init();
    }
    init(){
        this.wss.params=[];
        this.wss.params.isconnected=this.wss.params.inconnect=this.wss.params.isinroom=this.wss.params.islogged=false;
        this.wss.params.peerlist=[];
        this.wss.params.roomlist=[];
    }
    connect( url='ws://localhost:8100' ,reconnect=false){
        localStorage.setItem("wss-url",url);
        if(this.wss.params.isconnected || this.wss.params.inconnect){
            this.wss.onerror = this.wss.onopen = this.wss.onclose = null;
            try {
                this.wss.close();
            }catch (e) {
                console.warn(e);
            }
            this.init();
            this.autoReconnect=true;
        }
        if(!this.wss.params.inconnect){
            this.wss = new WebSocket(url);
            this.init();
            this.wss.params.inconnect=true;
            this.wss.onopen = ()=>{
                this.wss.params.inconnect=false;
                this.wss.params.isconnected=true;
                if(reconnect){
                    this.wss.params.peerID=localStorage.getItem("wss-peerID");
                    this.wss.params.alias=localStorage.getItem("wss-alias");
                    this.wss.params.room=localStorage.getItem("wss-room");
                    this.wss.params.instance=localStorage.getItem("wss-instance");
                    this.sendData({"signal":"reconnection",
                        "peerID":this.wss.params.peerID,
                        "alias":this.wss.params.alias,
                        "room":this.wss.params.room,
                        "instance":this.wss.params.instance,
                    })
                    this.wss.params.isinroom=true;
                    this.wss.params.islogged=true;
                }else{
                    try {this.onConnected()} catch (e) {}
                }
            }
            this.wss.onerror = (e)=>{
                this.init();
                try {this.onError(e)} catch (e) {}
            }
            this.wss.onclose = ()=>{
                try {this.onDisconnected()} catch (e) {}
                this.init();
            }
            this.wss.onmessage = ({data})=>{
                let isJSON,dataJson={};
                try {
                    dataJson = JSON.parse(data);
                    isJSON = true;
                } catch (e) {
                    isJSON = false;
                }
                if(isJSON){
                    switch(dataJson.signal){
                        case "login-ok":
                            this.wss.params.alias=dataJson.alias;
                            this.wss.params.peerID=dataJson.peerID;
                            localStorage.setItem("wss-peerID",dataJson.peerID);
                            localStorage.setItem("wss-alias",dataJson.alias);
                            this.wss.params.islogged=true;
                            this.oldPeerID=dataJson.peerID;
                            try {this.onLogged(dataJson)} catch (e) {}
                            break;
                        case "join-ok":
                            this.wss.params.instance=dataJson.instance;
                            this.wss.params.room=dataJson.room;
                            localStorage.setItem("wss-room",dataJson.room);
                            localStorage.setItem("wss-instance",dataJson.instance);
                            this.wss.params.isinroom=true;
                            try {this.onJoinedRoom(dataJson)} catch (e) {}
                            break;
                        case "left-ok":
                            delete this.wss.params.instance;
                            delete this.wss.params.room;
                            this.wss.params.isinroom=false;
                            try {this.onLeftRoom(dataJson)} catch (e) {}
                            break;
                        case "room-list":
                            this.wss.params.roomlist={'update':Date.now(),'list':dataJson.data};
                            break;
                        case "peer-list":
                            this.wss.params.peerlist=dataJson.list;
                            this.wss.params.peerlist.push({peerID: this.wss.params.peerID, alias: this.wss.params.alias});
                            try {this.onPeerConnected(dataJson)} catch (e) {}
                            break;
                        case "peer-join":
                            this.wss.params.peerlist.push({peerID: dataJson.peerID, alias: dataJson.alias});
                            try {this.onPeerConnected(dataJson)} catch (e) {}
                            break;
                        case "peer-left":
                            for (let i=0,l=this.wss.params.peerlist.length;i<l;i++){
                                if(this.wss.params.peerlist[i].peerID===dataJson.peerID){
                                    this.wss.params.peerlist.splice(i,1);
                                    break;
                                }

                            }
                            try {this.onPeerDisconnected(dataJson)} catch (e) {}
                            break;
                        case "kicked":
                        case "room-close":
                            this.autoReconnect=false;
                            this.wss.params.isinroom=false;
                            this.wss.params.peerlist=[];
                            try {this.onKicked(dataJson)} catch (e) {}
                            break;
                        case "error":
                            try {this.onError(dataJson)} catch (e) {}
                            break;
                        default:
                            try {this.onMessage(dataJson)} catch (e) {}
                            break;
                    }
                }
            }
        }
    }
    reconnect(){
        if(!this.wss.params.inconnect && !this.wss.params.isconnected){
            this.connect(localStorage.getItem("wss-url"),true);
        }
    }

    /**
     * [peerID:...,alias:...]
     * @returns {[]|*}
     */
    getPeerList(){
        return this.wss.params.peerlist;
    }
    getMyPeerID(){
        return this.wss.params.peerID;
    }
    getMyPeerAlias(){
        return this.wss.params.alias;
    }
    getMyRoom(){
        return this.wss.params.room;
    }
    getMyInstance(){
        return this.wss.params.instance;
    }
    getPeerAlias(peerID){
        let response = '';
        this.wss.params.peerlist.forEach(peer =>{
            if(peer.peerID===peerID){
                response = peer.alias;
            }
        })
        return response;
    }
    disconnect(){
        this.autoReconnect=false;
        if(this.wss){
            this.wss.close();
        }
        this.wss.params.inconnect=false;
    }
    sendMsg(message,sendCopy=false){
        if(this.isLogged() && this.isInRoom() && message!==''){
            this.sendData({"message":message,"return":sendCopy})
            try {this.onSendMsg(message)} catch (e) {}
        }
    }
    log(Alias){
        if(Alias!=='') {
            this.sendData({"signal":"login","alias": Alias,})
        }
    }
    joinRoom(Room,Instance=0){
        if(Room!==''&&Instance!=='') {
            this.sendData({
                "signal": "join",
                "room": Room,
                "instance": Instance,
            })
        }else{
            try {this.onError({"signal":"error","details":"You need to be logged before join a room"})} catch (e) {}
        }
    }
    leftRoom(){
        if(typeof this.wss.params.isinroom !== 'undefined') {
            this.sendData({
                "signal": "left",
            })
        }
    }
    sendData(array){
        if(this.isConnected()){
            this.wss.send(JSON.stringify(array));
        }
    }
    isInRoom(){
        if(typeof this.wss.params.isinroom === 'undefined'){this.wss.params.isinroom=false}
        return this.wss.params.isinroom;
    }
    isConnected(){
        if(typeof this.wss.params.isconnected === 'undefined'){this.wss.params.isconnected=false}
        return this.wss.params.isconnected;
    }
    isLogged(){
        if(typeof this.wss.params.islogged === 'undefined'){this.wss.params.islogged=false}
        return this.wss.params.islogged;
    }
    isSupportMultiplayer(){
        return ('WebSocket' in window || 'MozWebSocket' in window);
    }

    /**
     * return list of current room
     * @async
     * @returns {Promise<array>}
     */
    async getListRoomPublic(){
        let that=this;
        function thread(){
            return new Promise(resolve => {
                let interval = setInterval(function() {

                    if(typeof that.wss.params.roomlist!=="undefined" && that.wss.params.roomlist.update+30>=Date.now()) {
                        resolve(that.wss.params.roomlist.list);
                        clearInterval(interval);
                    }
                }, 20);
            });
        }
        if(this.isConnected()){
            if(typeof that.wss.params.roomlist==="undefined"){
                this.wss.params.roomlist=[];
            }
            this.wss.params.roomlist.update=0;
            this.sendData({
                "signal": "room-list",
            })
            return await thread();
        }
        return false;
    }
    debug(index){
        this.sendData({
            "signal": "debug"+index,
        })
    }
}
