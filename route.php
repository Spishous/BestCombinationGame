<?php

use function Tools\check;
use function Tools\has;

abstract class route{
    static function run(): array{
        /**
         *      check() -> l'url est identique
         *      has() -> url comment par ...
         **/
        if(check("")){
            if(isset($_GET['log'])){
                return [
                    'template'=>$template??'',
                    'title'=>'Login admin',
                    'page'=>'login',
                ];
            }
            $title="Best Combination Game";
            $template="main";
            $page="main";
        }
        elseif(check("/room")){
            $page="choixroom";
            $template="choixroom";
        }
        elseif(check("/kantu")){
            $page="Kantu/index";
            $template="game";
            $title="Kantu";
        }
        elseif(check("/pyramid")){
            $page="Pyramid/index";
            $title="La pyramide";
        }
        elseif(check("/never-have-i-ever")){
            $page="Never Have I Ever/index";
            $template="game";
            $title="Je n'ai jamais";
        }
        elseif(check("/limit-limit")){
            $page="Limite Limite/index";
            $template="game";
            $title="Limite Limite";
        }
        elseif(check("/100")){
            $page="100/index";
            $template="game";
            $title="Le jeu du 100";
        }
        elseif(check("/dealer")){
            $page="Dealer/index";
            $title="Jeu du Dealer";
        }
        elseif(check("/multiplayer-zone")) {
            $page = "Multiplayer Zone/index";
            $template="game";
            $title="Zone Multijoueur";
        }
        elseif(check("/about")){
            $page="about";
            $title="about";
            $template="main";
        }
        elseif(check("/report")){
            $page="report";
            $title="Signaler";
            $template="main";
        }
        elseif(check("/statistique/savelog")){
            $page="../log/addlog";
        }
        elseif(check("/statistique/statelog")){
            $page="statelog";
            $template="main";
        }
        else{
            $title='Page non trouvée';
            $page="404";
        }
        return [
            'template'=>$template??'',
            'title'=>$title??'',
            'page'=>$page??'',
        ];
    }
}
