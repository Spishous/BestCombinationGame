<button id="btnRetour"  class="close">
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="fa-times"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="fa-arrow-left"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z" class=""></path></svg>
</button>
<div id="sectionRoom">
<section id="s1" class="active">
    <div style="width: 100%;padding: 10px;">
        <input type="text" id="usrn" autocomplete="off" placeholder="Pseudo">
        <button class="btn btn-enter" disabled>Entrer</button>
    </div>
</section>
    <section id="s1a">
        <div style="width: 100%;padding: 10px;">
            <div class="zone-avatar">
                <div class="avatar" data-f="1" data-h="1" data-hf="1" data-m="2"></div>
                <div class="tools-avatar">
<!--                    <div id="AGenre" class="change-element">genre</div>-->
                    <div id="AHair" class="change-element">cheveux</div>
                    <div id="ACHair" class="change-element">couleur de cheveux</div>
                    <div id="AFace" class="change-element">couleur de peau</div>
                </div>
            </div>

            <script>
                let avatar="";
                $(function(){
                    let listCustom={
                        'AHair':{'data':'data-hf','min':0,'max':1},
                        'ACHair':{'data':'data-h','min':0,'max':4},
                        'AFace':{'data':'data-f','min':0,'max':3}
                    }
                    $('.tools-avatar .change-element').prepend('<button><i class="fas fa-angle-left"></i></button>').append('<button><i class="fas fa-angle-right"></i></button>');
                    $(document).on('click','.tools-avatar .change-element button',function(e){
                        let el=e.target,affect=0,nameTool=$(el).parents('.change-element').attr('id');
                        if($(el).hasClass('fa-angle-left')){
                            affect=-1;
                        }
                        if($(el).hasClass('fa-angle-right')){
                            affect=1;
                        }
                        if(affect!==0){
                            let val=(parseInt($('.avatar').attr(listCustom[nameTool].data))+affect);
                            if(val<listCustom[nameTool].min){
                                val=listCustom[nameTool].max;
                            }
                            if(val>listCustom[nameTool].max){
                                val=listCustom[nameTool].min;
                            }
                            $('.avatar').attr(listCustom[nameTool].data,val);
                            if(avatar!==""){
                                avatar.save_data_avatar();
                            }
                        }
                    })
                })
                let arrayPlayer=[];
                document.querySelectorAll('.avatar').forEach(elment=>{
                    avatar=new Avatar(elment);
                    arrayPlayer.push(avatar);
                    let code=avatar.load_data_avatar();
                    if(code!==null){
                        avatar.set_data_avatar(code);
                    }
                    if(avatar!==""){
                        avatar.save_data_avatar();
                    }
                    elment.addEventListener('click',function(){
                        this.setAttribute('data-f',Math.ceil(Math.random()*5)-1);
                        this.setAttribute('data-h',Math.ceil(Math.random()*5)-1);
                        this.setAttribute('data-m',Math.ceil(Math.random()*4)-1);
                        this.setAttribute('data-hf',Math.ceil(Math.random()*2)-1);
                        this.setAttribute('data-e',Math.ceil(Math.random()*2)-1);
                    })
                })
            </script>
            <button class="btn btn-enter">Entrer</button>
        </div>
    </section>
    <section id="s2">
        <button class="btn btn-rp"><i class="fas fa-sign-in-alt"></i>Rejoindre une partie</button>
        <button class="btn btn-cp"><i class="fas fa-plus"></i>Créer une partie</button>
    </section>
    <section id="s3" class="">
        <h2>Nouvelle partie</h2>
        <div class="container-1">
            <div class="content-1">
                <input type="text" id="roomname" autocomplete="off" placeholder="Room">
                <div class="info-error"></div>
                <div class="select-switch">
                    <input type="checkbox" id="privateRoom">
                    <label for="privateRoom">
                        <span>Partie privée</span>
                        <span class="btn-switch"></span>
                    </label>
                    <span id="help-btn"></span>
                </div>
                <button class="btn btn-cree-room">Créer</button>
            </div>
        </div>
    </section>
    <section id="s4">
        <h2>Liste des parties</h2>
        <div id="listRoom" class="container-1 content-1">

        </div>
    </section>
</div>
<div id="pagination">
<span class="active"></span>
<span></span>
<span></span>
<span></span>
</div>
<script src="/assets/js/multiplayer.js"></script>
<script>
$(function(){
    $('input#privateRoom')[0].checked=false;
    let multi = new Multiplayer(),
        gameName="<?=$_GET['game']?>",
        username=localStorage.getItem('username'),
        instance=gameName;
        setRoomType();
    if(username){
        $('input#usrn').val(username);
        checkInputName();
    }
    function setRoomType(roomPrivate=false){
        instance=gameName;
        if(roomPrivate){
            instance+="_private";
        }
        localStorage.setItem('instance',instance);
    }
    function checkInputName(){
        if($('#s1.active').length===1){
            if($('input#usrn').val().length>1){
                $('#s1 .btn-enter').removeAttr('disabled');
            }else{
                $('#s1 .btn-enter').attr('disabled',true);
            }
        }

    }
    $(document).on('keypress keydown past keyup',function(){
        checkInputName();
    })
    .on('click','#s1 .btn-enter',function(){
        username=$('input#usrn').val();
        if(username.length>1){
            localStorage.setItem('username',username);
            multi.connect('wss://bestcombinationgame.alwaysdata.net/wss');
            multi.onConnected=()=>{multi.log(username)}
            $('#s1').removeClass('active').addClass('oldActive');
            $('#s1a').addClass('active');
            pagination(1)
        }
    })
    .on('click','#s1a .btn-enter',function(){
        $('#s1a').removeClass('active').addClass('oldActive');
        $('#s2').addClass('active');
        pagination(2)
    })
    .on('click','#s2 .btn-cp',function(){
        $('#s2').removeClass('active').addClass('oldActive');
        $('#s3').addClass('active');
        pagination(3)
        //$('#roomname').select()
    })
    .on('click','#s2 .btn-rp',async function(){
        $('#s2').removeClass('active').addClass('oldActive');
        $('#s4').addClass('active');
        pagination(3);
        let list = await multi.getListRoomPublic();
        showRoomList(list);
        refreshListRoom=setInterval(async function () {
            let oldlist=list;
            list = await multi.getListRoomPublic();
            if(list[0]!==oldlist[0]){
                showRoomList(list);
            }
        },2000)
    })
    .on('click','#btnRetour',function(){
        if(typeof refreshListRoom!=='undefined'){
            clearInterval(refreshListRoom)
            delete refreshListRoom
        }
        if($('#sectionRoom section.active').index()>0){
            $('#sectionRoom section.active').removeClass('active');
            let page=Math.min($('#sectionRoom section.oldActive').last().index(),2);
            $('#sectionRoom section.oldActive').eq(page).removeClass('oldActive').addClass('active');
            pagination(page)
        }else{
            window.location='.';
        }
    })
    .on('click','li[name-room]',function(){
        let room=$(this).attr('name-room');
        if(room){
            localStorage.setItem('room',room);
            document.location.href="<?=SUBDOMAINE.'/'.$_GET['game']?>";
        }

    })
    .on('keypress keyup paste','input#roomname',function(){
        if($(this).val().length>2){
            $('.btn-cree-room').removeAttr('disabled');
            $('section#s3 .info-error').text('');
        }else{
            $('section#s3 .info-error').text('Le nom de la room est trop court');
            $('.btn-cree-room').attr('disabled',true);
        }
    })
    .on('click','.btn-cree-room',async function(){
        let nameroom=$('input#roomname').val()
        if(nameroom.length>2){
            let list= await multi.getListRoomPublic();
            let roomAlreadyExist=false;
            if(list!==false){
                list.forEach(e=>{
                    x=e.split(';');
                    if(x[0]===nameroom && x[1]===instance){
                        roomAlreadyExist=true;
                    }
                })
            }
            if(roomAlreadyExist){
                $('section#s3 .info-error').text('Ce nom de room est déjà pris :/');
            }else{
                localStorage.setItem('room',nameroom);
                document.location.href="<?=SUBDOMAINE.'/'.$_GET['game']?>";
            }
        }else{
            $('.btn-cree-room').attr('disabled',true);
        }
    })
    .on('change','#privateRoom',function(){
        setRoomType($(this).is(':checked'));
    })
    .on('click','#help-btn',function(){
        let msg="Les parties privées ne sont pas visibles dans la liste pour rejoindre une partie.<br> Pour rejoindre une partie privée vous devez envoyer le lien ou flasher le QR Code visible dans la room.";
        openHelp(msg);
    })
    .on('click','.help-popup',function(e){
        if(1){//this===e.target){
            $(this).fadeOut(300,function(){$(this).remove()})
        }
    })
    function showRoomList(list){
        let container=$('#listRoom'),nameroom="",listHtml="";
        container.html('');
        if(list!==false){
            list.forEach(e=>{
                x=e.split(';');
                nameroom=x[0];
                if(x[1]===instance){
                    listHtml += "<li name-room='" + nameroom + "'><span class='room-status'></span><span class='room-name'>" + nameroom + "</span></li>";
                }
            })
        }
        container.append("<ul>"+listHtml+"</ul>")
    }
    function pagination(number){
        if(number){
            $('#btnRetour').removeClass('close');
        }else{
            $('#btnRetour').addClass('close');
        }
        $('#pagination span').removeClass('active');
        $('#pagination span').eq(number).addClass('active');
    }
    function openHelp(msg){
        let contentHtml='<div class="help-popup" style="display: none">'+
            '<div class="help-content"><h1>Aide</h1><p>'+msg+'</p></div></div>';
        $('.help-popup').remove();
        $('body').append(contentHtml);
        $('.help-popup').fadeIn(300)
    }
    $.ajax({
        url : 'https://friendly-words.netlify.app/.netlify/functions/random',
        type : 'GET',
        success:function(e){
            $('#roomname').val(e);
            if($('input#roomname').val().length>2){
                $('.btn-cree-room').removeAttr('disabled');
            }else{
                $('.btn-cree-room').attr('disabled',true);
            }
        }
    })
})
</script>
