<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    [meta]
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>[title]</title>
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" sizes="128x128" href="/assets/src/icon/app-bcg.png">
    <link rel="stylesheet" href="./template-game.css">
    <link rel="stylesheet" href="/assets/css/font-icon.css">
    <link rel="stylesheet" href="/assets/css/avatar.css">
    <script src="/assets/js/avatar.js"></script>
    <script src="/assets/js/jquery.js"></script>
    <?php
        if(isset($_GET['shareRoom'],$_GET['room'],$_GET['instance']) && $_GET['shareRoom']==1){ ?>
            <script>
                localStorage.setItem('room',"<?=$_GET['room']?>");
                localStorage.setItem('instance',"<?=$_GET['instance']?>");
                localStorage.setItem('username',localStorage.getItem('username')??'new player');
            </script>
    <?php } ?>
</head>
<body class="no-scroll waitingRoom">
<div class="top-bar">
    <div class="bg-menu-side"></div>
    <div class="content-menu-side">
        <div class="container-menu-side">
            <div class="logo-menu"><img alt="" src="/assets/src/logo-bcg.png"><span>BCG</span></div>
            <nav class="menu-content-head">
                <ul>
                    <li><a href="/">Quitter</a></li>
                </ul>
                <div id="members-zone">
                    <h3 id="player-count">-</h3>
                </div>
            </nav>
        </div>
    </div>
    <div class="menu-style menu-hamburger">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <h1 id="info">[title]</h1>
</div>
[content]
<div id="waitingRoom" class="show">
    <style>#closeRoom {cursor: pointer;position: absolute;color: #4f4637;top: 15px;left: 1em;z-index: 1;font-size: 22px;visibility: visible;}</style>
    <i id="closeRoom" class="fas fa-times"></i>
    <h1>Connexion..</h1>
    <div class="info-room">
        <span id="gameName">[title]</span>
        <span id="roomName">..</span>
        <span id="playerCount">..</span>
    </div>
    <div class="list-player">
        <ul></ul>
    </div>
    <div class="action-room">
        <span class="btn btn-style2" id="shareLink"><i class="fas fa-link"></i></span>
        <a href="/" class="btn btn-style1">Quitter</a>
        <span class="btn btn-style1" id="btnStartGame" style="display:none">Jouer</span>
    </div>
</div>
<div id="shareLinkCont">
    <div class="qrcode-content">
        <div id="qrcode" title=""><canvas width="256" height="256" style="display: none;"></canvas><img src="" style="display: block;"></div>
        <span id="copyLink" class="btn">Copier le lien</span>
    </div>
</div>
<div id="msg">
    <span id="btnMsg">
        <span id="notifMsg">0</span>
    </span>
    <div class="scroll-modal">
        <div id="modalMsg">
            <div class="top-bar">
                <i class="fas fa-times"></i>
                <h1>Message</h1>
            </div>
            <div class="msg-container">
                <ul></ul>
            </div>
            <div class="bot-bar">
                <div id="inputMsg"><input type="text" id="saisie"><i class="fas fa-times"></i></div>
                <span id="sendMsg"><i class="fas fa-share"></i></span>
            </div>
        </div>
    </div>

</div>
<script src="/assets/js/qrcode.min.js"></script>
<script>
    if (history.scrollRestoration) {history.scrollRestoration = 'manual';}
    let linkShare=window.location.origin+window.location.pathname+'?shareRoom=1&room='+localStorage.getItem('room')+'&instance='+localStorage.getItem('instance');
    document.querySelector('.qrcode-content #qrcode').setAttribute('title',linkShare)
    if(isMobile()){
        document.querySelector('#copyLink').classList.add('mobileShare')
        document.querySelector('#copyLink').innerHTML='<i class="fas fa-share-square" style="margin-right:10px"></i>Partager le lien';
    }
    //GENERATION DU QRCODE
    qrcode = new QRCode("qrcode");
    qrcode.makeCode(linkShare);
    /*Message*/
    let isTouch=false,unscrollMsgT=0,touchScroll=false;
    document.querySelector('#btnMsg').addEventListener('click',function(){
        isTouch=false;
        this.classList.remove('notified');
        document.body.classList.add('tchatOpen');
        document.querySelector('.scroll-modal').classList.add('show');
        document.querySelector('.scroll-modal').scrollTop=9999;
        scrollMsgToBottom();
    })
    document.querySelector('.scroll-modal').addEventListener('scroll',function(e){
        if(!isTouch){
            unscrollMsg();
            if(e.target.scrollTop+100<(e.target.scrollHeight-e.target.offsetHeight)){closeMsg()}
        }
    })
    document.querySelector('#modalMsg .top-bar .fa-times').addEventListener('click',function(){closeMsg()})
    document.querySelector('.scroll-modal').addEventListener('touchstart',function(){isTouch=true})
    document.querySelector('.scroll-modal').addEventListener('touchend',function(){
        isTouch=false;
        let e=document.querySelector('.scroll-modal')
        if(e.scrollTop+30<(e.scrollHeight-e.offsetHeight)){closeMsg()}
        else{e.scrollTop=e.scrollHeight;}
    })
    function unscrollMsg(){
        unscrollMsgT=Date.now();
        setTimeout(function(){
            let e=document.querySelector('.scroll-modal')
            if(unscrollMsgT!==0 && unscrollMsgT<Date.now()-150){
                if(e.scrollTop+100<(e.scrollHeight-e.offsetHeight)){closeMsg()}
                else{e.scrollTop=e.scrollHeight}
            }
        },200)
    }
    function closeMsg(){
        unscrollMsgT=0;
        document.querySelector('#modalMsg #inputMsg #saisie').blur()
        document.querySelector('#btnMsg').classList.remove('notified');
        document.querySelector('#btnMsg #notifMsg').innerHTML="0";
        document.body.classList.remove('tchatOpen');
        document.querySelector('.scroll-modal').classList.remove('show');
    }
    function setInputMsg(bool){
        if(bool){
            $('#modalMsg #sendMsg').removeAttr('disabled');
            $('#modalMsg #inputMsg .fas.fa-times').css('opacity','');
        }else{
            $('#modalMsg #sendMsg').attr('disabled',true);
            $('#modalMsg #inputMsg .fas.fa-times').css('opacity','0');
        }
    }
    let msgBox=document.querySelector('.msg-container ul');
    $(function(){
        let saisieMsg=$('#modalMsg #inputMsg #saisie');
        setInputMsg(false);
        $('#modalMsg #inputMsg .fas.fa-times').on('click',function(){
            setInputMsg(false);
            saisieMsg.val("");
            saisieMsg.focus();
        })
        saisieMsg.on('keypress keydown paste keyup',function(){
            setInputMsg(saisieMsg.val());
        }).on('keypress',function(e){
            if(e.key==='Enter'){sendMsg()}
        })
        $('#modalMsg #sendMsg').on('click',function(){
            sendMsg()
        })
        function sendMsg(){
            if(multiplayer.isLogged() && saisieMsg.val().trim()!==""){
                multiplayer.sendMsg(Protocol.MESSAGE + saisieMsg.val(), true);
                msgBox.innerHTML+='<li class="msg-my-text sended">'+saisieMsg.val()+'</li>';
                setInputMsg(false);
                saisieMsg.val("");
                saisieMsg.focus();
                scrollMsgToBottom();
            }
        }
    })
    function isMobile(){
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
    document.getElementById('shareLink').addEventListener('click', function(){
        document.getElementById('shareLinkCont').classList.add('show');
    });
    document.querySelector('#shareLinkCont').addEventListener('click', function(e){
        if(e.target===document.querySelector('#shareLinkCont')){
            document.querySelector('#shareLinkCont').classList.remove('show');
        }
    });
    document.getElementById('copyLink').addEventListener('click',function(){
        this.classList.remove('link-copied');
        if (navigator.share && this.classList.contains("mobileShare")) {
            navigator.share({
                title: "[title]",
                url: linkShare
            }).then(() => {
                console.log('Thanks for sharing!');
            })
                .catch(console.error);
        }else{
            setTimeout(()=>{this.classList.add('link-copied')},);
            copyToClipboard(linkShare);
        }
    });
    //COPY (LINK)
    function copyToClipboard(str){
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
    let lastPeerIDMsg="";
    function scrollMsgToBottom(){
        document.querySelector('.msg-container').scrollTop=document.querySelector('.msg-container').scrollHeight;
    }
    function postMessage(peedID,Message){
        if(multiplayer.getMyPeerID()===peedID){
            lastPeerIDMsg=peedID;
            document.querySelectorAll('.msg-my-text.sended').forEach(element=>{
                element.classList.remove('sended');
            })
        }else{
            let countNotif=Math.min(9,(parseInt(document.querySelector('#btnMsg #notifMsg').innerHTML)||0))+1;
            document.querySelector('#btnMsg #notifMsg').innerHTML=((countNotif===10)?"9+":countNotif);
            document.querySelector('#btnMsg').classList.add('notified');
            if(lastPeerIDMsg!==peedID){
                lastPeerIDMsg=peedID;
                msgBox.innerHTML+='<li class="msg-peer-name">'+multiplayer.getPeerAlias(peedID)+'</li>';
            }
            msgBox.innerHTML+='<li class="msg-text">'+Message+'</li>';
        }
        scrollMsgToBottom();
    }
    /*Fin Message*/
    if(!(localStorage.getItem('room') && localStorage.getItem('instance') && localStorage.getItem('username'))){
        window.location.replace(window.location.href+'/..');
    }
    if (document.querySelector('#waitingRoom.show') !== null) {
        document.querySelector('#waitingRoom #roomName').innerText = localStorage.getItem('room');
        //document.querySelector('#waitingRoom #gameName').innerText = localStorage.getItem('instance');
    }
    document.getElementById('btnStartGame').addEventListener('click',function(){
        startGame();
    })
    document.getElementById('closeRoom').addEventListener('click',function(){
        document.getElementById('waitingRoom').remove();
        document.body.classList.remove('waitingRoom','no-scroll');
    })
    //OPEN MENU
    document.querySelector('.menu-hamburger').addEventListener('click',function(){
        if(!this.classList.contains('open')){
            this.classList.add('open');
            document.querySelector('.bg-menu-side').classList.add('open');
            document.body.classList.add('no-scroll');
        }else{
            this.classList.remove('open');
            document.querySelector('.bg-menu-side').classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    })
    //CLOSE MENU
    document.querySelector('.bg-menu-side').addEventListener('click',function(){
        this.classList.remove('open');
        document.querySelector('.menu-hamburger').classList.remove('open');
        document.body.classList.remove('no-scroll');
    })
</script>
</body>
</html>
