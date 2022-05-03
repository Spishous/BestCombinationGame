<html lang="fr">
<head>
<meta charset="UTF-8">
[meta]
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>[title]</title>
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" sizes="128x128" href="/assets/src/icon/app-bcg.png">
    <link rel="stylesheet" href="./template.css">
    <link rel="stylesheet" href="/assets/css/font-icon.css">
</head>
<body>
<div class="extra-design">
    <span class="bubble1"></span>
</div>
<div class="top-bar">
    <div class="bg-menu-side">

    </div>
    <div class="content-menu-side">
        <div class="container-menu-side">
            <div class="logo-menu"><img alt="" src="/assets/src/logo-bcg.png"><span>BCG</span></div>
            <nav class="menu-content-head">
                <hr>
                <span>Menu</span>
                <ul class="menu-nav">
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/about">A propos</a></li>
                    <li><a href="/report">Signaler</a></li>
                </ul>
                <hr>
                <span>Profils</span>
                <ul class="menu-profil">
                    <li>
                        <div id="zone-profil">
                            <img src="https://media-exp1.licdn.com/dms/image/C4D03AQHwF9kUbyxtbg/profile-displayphoto-shrink_400_400/0/1596038081974?e=1632355200&amp;v=beta&amp;t=OBcYlh0AhRc_CCa7DLspOBZ8txHhHWZRu3eB3DMLlq4">
                            <div id="profil-info">
                                <span id="profil-name">Timothée Girard</span>
                                <span id="profil-job">Business Development Leader</span>
                            </div>
                        </div>
                        <div id="zone-link">
                            <a class="style-linkedin" target="_blank" href="https://www.linkedin.com/in/timoth%C3%A9e-girard-15b977151/"><i class="fab fa-linkedin-in"></i></a>
                            <a class="style-insta" target="_blank" href="https://www.instagram.com/timotheegirard2/?hl=fr"><i class="fab fa-instagram"></i></a>
                            <a class="style-facebook" target="_blank" href="https://www.facebook.com/timothee.girard.98/"><i class="fab fa-facebook-f"></i></a>
                        </div>
                    </li>
                    <li>
                        <div id="zone-profil">
                        <img src="/assets/src/rayan.jpeg">
                        <div id="profil-info">
                            <span id="profil-name">Rayan Lucas</span>
                            <span id="profil-job">Full-Stack Developer</span>
                        </div>
                        </div>
                        <div id="zone-link">
                            <a class="style-linkedin" target="_blank" href="https://www.linkedin.com/in/rayan-lucas-772ab0192/"><i class="fab fa-linkedin-in"></i></a>
                            <a class="style-insta" target="_blank" href="https://www.instagram.com/luc_ray/"><i class="fab fa-instagram"></i></a>
                        </div>
                    </li>

                </ul></nav>
            <div class="menu-content-footer">
                <?php
                if(isset($_SESSION['status'])){
                    echo '<a href="?logout">Déconnexion</a>';
                }?>

            </div>
        </div>

    </div>
    <div>
        <div class="menu-style menu-hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>

    <?php
    if(isset($_SESSION['status']) && $_SESSION['status']=='admin'){?>
        <div class="profil">
            <span class="profil-name"><?=($_SESSION['user']['name']??'Admin')?></span>
            <span class="profil-pic" style="background-image: url('/assets/src/profil/<?=($_SESSION['user']['pic']??'')?>')"></span>
        </div>
        <?php
    }
    ?>

</div>
[content]
<script>
    document.querySelectorAll('ul.menu-profil li').forEach(elment=>{
        elment.addEventListener('click',function(){
            this.classList.toggle('show-info')
        })
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
