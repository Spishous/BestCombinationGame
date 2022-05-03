//SUPPRIME L'HISTORIQUE DU SCOLL
if (history.scrollRestoration) {history.scrollRestoration = 'manual';} else {window.onbeforeunload = function () {window.scrollTo(0, 0);}}
let listGameInit=document.querySelector('#splide .list-game').innerHTML,
//GENERATION DU QRCODE
qrcode = new QRCode("qrcode");
function makeCode () {
    let elText = document.getElementById("qrcodeLink");
    if (!elText.value){console.log("Mettre un texte");return;}
    qrcode.makeCode(elText.value);
}
makeCode();
//ANIMATION
document.body.onscroll=function(){
    if(document.body.scrollTop>60){
        document.querySelector('.hide-element').classList.add('show');
    }else{
        document.querySelector('.hide-element').classList.remove('show');
    }
}
//CARD INFO
document.addEventListener('click',function(e){
    let openFilter=document.querySelector('.filter.open')
    if(!e.target.closest(".filter") && openFilter){
        openFilter.classList.remove('open');
    }
    let openInfo=document.querySelector('#popup.show')
    if(!e.target.closest(".popup-info") && !e.target.closest(".splide__slide") && openInfo){
        closePopup();
    }
})
//Clique sur les cartes
function initCard(){
    document.querySelectorAll('.splide__slide').forEach(card=>{
        card.addEventListener('click',function(){
            let link=card.getAttribute('link');
            if(card.getAttribute('disabled')===null && link){
                let title=card.querySelector('.title').innerText,fullLink=window.location.href;
                if(!fullLink.endsWith('/')){
                    fullLink+='/';
                }
                if(link[0] === "/"){
                    fullLink+=link.substr(1);
                    fullLink=fullLink.replace('/dev','');
                }else{
                    fullLink+="room?game="+link;
                }
                document.querySelector('.popup-info #qrcodeLink').value=fullLink;
                document.querySelector('.popup-info .btn-play').setAttribute('href',fullLink);
                document.querySelector('.popup-info h1').innerText=title;
                makeCode();
                document.body.classList.add('no-scroll');
                unscrollPopupT=0;isTouch=false;
                document.querySelector('#popup').classList.add('show');
                document.querySelector('#popup').scrollTop=9999;
                scrollToBottom();
                document.querySelector('#popup').addEventListener('scroll',function(e){
                    if(!isTouch){
                        unscrollPopup();
                        if(e.target.scrollTop+100<(e.target.scrollHeight-e.target.offsetHeight)){
                            closePopup();
                        }
                    }

                })
                document.querySelector('#popup').addEventListener('touchstart',function(){isTouch=true;})
                document.querySelector('#popup').addEventListener('touchend',function(){
                    isTouch=false;
                    let e=document.querySelector('#popup.show')
                    if(e.scrollTop+30<(e.scrollHeight-e.offsetHeight)){closePopup();}
                    else{e.scrollTop=e.scrollHeight;}
                })
            }
        })
        document.querySelector('.popup-info #copyLink').addEventListener('click',function(){
            let link=document.querySelector('.popup-info #qrcodeLink').value;
            if(link){copyToClipboard(link);}
        })
    })
}
initCard();
function scrollToBottom(){
    document.querySelector('#popup').scrollTop=document.querySelector('#popup').scrollHeight;
}
let unscrollPopupT=0,isTouch=false;
function unscrollPopup(){
    unscrollMsgT=Date.now();
    setTimeout(function(){
        let e=document.querySelector('#popup')
        if(unscrollMsgT!==0 && unscrollMsgT<Date.now()-150){
            if(e.scrollTop+100<(e.scrollHeight-e.offsetHeight)){closePopup()}
            else{e.scrollTop=e.scrollHeight}
        }
    },200)
}
function closePopup(){
    unscrollPopupT=0,isTouch=false;
    document.body.classList.remove('no-scroll');
    document.querySelector('#popup').classList.remove('show');
}
//FILTRE
document.getElementById('open-filter').addEventListener('click',function(){
    document.querySelector('.filter').classList.toggle('open')
})
document.querySelectorAll('.filter-choice .choice').forEach(element =>{
    element.addEventListener('click',function(){
        if(this.classList.contains('active')){
            this.classList.remove('active');
        }else{
            this.parentElement.querySelectorAll('.choice').forEach(elmt=>{
                elmt.classList.remove('active');
            })
            this.classList.add('active');
        }
        filter();
    })
})
function filter(){
    let choicePlayer=document.querySelector('.type-filter.filter-player .choice.active'),
        choiceSupport=document.querySelector('.type-filter.filter-support .choice.active'),
        value="",filterCount=0;

    document.querySelector('#splide .list-game').innerHTML=listGameInit;

    if(choicePlayer){
        filterCount++;
        let value=choicePlayer.getAttribute('value');
        document.querySelectorAll('.splide__slide .nb-player').forEach(nbPlayer=>{
            let regex=new RegExp('['+nbPlayer.innerText+']'),
                found = value.match(regex);
            if(!found){
                nbPlayer.parentElement.remove();
            }
        })
    }
    if(choiceSupport){
        filterCount++;
        value=choiceSupport.getAttribute('value');
        switch (value){
            case "1":
                document.querySelectorAll('.splide__slide .support').forEach(typeSupport=>{
                    if(!typeSupport.getAttribute('class').includes('local')){typeSupport.parentElement.remove();}
                })
                break;
            case "2":
                document.querySelectorAll('.splide__slide .support').forEach(typeSupport=>{
                    if(!typeSupport.getAttribute('class').includes('multi')){typeSupport.parentElement.remove();}
                })
                break;
        }
    }
    if(filterCount){
        document.getElementById('filterCount').innerText=filterCount.toString();
    }else{document.getElementById('filterCount').innerText=''}
    splide.refresh();
    initCard();
}
//COPY (LINK)
function copyToClipboard(str){
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
