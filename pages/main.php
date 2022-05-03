<link rel="stylesheet" href="/assets/css/main.css">
<div class="main">
        <div class="container">
            <h1 style="text-align: center;">Meilleurs jeux entre amis</h1>
            <br>
            <div class="filter">
                <button id="open-filter">Filtre</button>
                <span id="filterCount"></span>
                <div class="filter-content">
                    <div class="type-filter filter-player">
                        <h3>Joueur</h3>
                        <div class="filter-choice">
                            <span class="choice" type="filter-player" value="1"><p>Solo</p></span>
                            <span class="choice" type="filter-player" value="2"><p>Duo</p></span>
                            <span class="choice" type="filter-player" value="3,4,5"><p>Groupe</p></span>
                        </div>
                    </div>
                    <div class="type-filter filter-support">
                        <h3>Support</h3>
                        <div class="filter-choice">
                            <span class="choice" type="filter-player" value="1"><img src="/assets/src/single-mobile.png"><p>Local</p></span>
                            <span class="choice" type="filter-player" value="2"><img src="/assets/src/multi-mobile.png"><p>Online</p></span>
                        </div>
                    </div>
<!--                    <div class="type-filter filter-categ">
                        <h3>Genre</h3>
                        <div class="filter-choice"></div>
                    </div>-->
                </div>
            </div>
        </div>
        <div id="splide" class="splide">
            <div class="splide__track">
                <ul class="splide__list list-game">
                    <li class="splide__slide type-society" link="limit-limit">
                        <span class="title">Limite Limite</span>
                        <div class="support multi"></div>
                        <span class="nb-player">3-6</span>
                        <span class="best-rate"></span>
                    </li>
                    <li class="splide__slide type-society" link="never-have-i-ever">
                        <span class="title">Je n'ai jamais</span>
                        <div class="support local multi"></div>
                        <span class="nb-player">1-6</span>
                    </li>
                    <li class="splide__slide type-society" link="kantu">
                        <span class="title">Kantu</span>
                        <div class="support multi"></div>
                        <span class="nb-player">3-6</span>
                    </li>
                    <li class="splide__slide type-card" link="100">
                        <span class="title">Jeu du 100</span>
                        <div class="support multi"></div>
                        <span class="nb-player">2-6</span>
                    </li>
                    <li class="splide__slide type-card" link="/pyramid">
                        <span class="title">Jeu de la pyramide</span>
                        <div class="support local"></div>
                        <span class="nb-player">3-6</span>
                    </li>
                    <li class="splide__slide type-card" link="/dealer">
                        <span class="title">Jeu du dealer</span>
                        <div class="support local"></div>
                        <span class="nb-player">3-6</span>
                    </li>
                    <li class="splide__slide type-card" link="multiplayer-zone">
                        <span class="title">Zone Multijoueur</span>
                        <div class="support multi"></div>
                        <span class="nb-player">1-6</span>
                    </li>
                </ul>
            </div>
        </div>
    <div id="popup"><div id="popup-container">
    <div class="popup-info">
        <h1>Game</h1>
        <div class="qrcode-content">
            <div id="qrcode"></div>
            <span id="copyLink" class="btn">Copier le lien</span>
        </div>
        <input id="qrcodeLink" type="hidden" value="<?=DOMAINE.SUBDOMAINE?>" style="width:200px"/>
        <a class="btn btn-play">Jouer</a>
    </div>
        </div></div>
    <div class="hide-element">
        <hr><br>
        <div class="container">
            <h2>Auteurs :</h2>
            <div class="author">Timothée Girard</div>
            <div class="author">Rayan Lucas</div>
        </div>
    </div>
</div>
<link rel="stylesheet" href="/assets/css/splide.min.css">
<script src="/assets/js/splide.min.js"></script>
<script>
    let splide=new Splide( '#splide' , {
        perPage: 3,
        perMove:1,
        autoWidth: true,
        focus    : 'center',
        trimSpace  : false,
        rewind: true,
    } ).mount();
</script>
<script src="/assets/js/qrcode.min.js"></script>
<script src="/assets/js/main_script.js"></script>
