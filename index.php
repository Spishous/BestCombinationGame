<?php
use Tools\Tools;
require('app.php');
abstract class main{
    const adminLog=[
        '9741'=>'rayan',
        '7919'=>'tim',
    ];
    const adminUser=[
        'rayan'=>[
            'name'=>'Rayan',
            'pic'=>'53474519.png',
        ],
        'tim'=>[
            'name'=>'Timothée',
            'pic'=>'62565006.jpg',
        ],
    ];
    static function run(){
        @session_start();
        if(isset($_GET['logout'])){
            static::logout();
            static::removeGetURL();
        }
        if(empty($_SESSION['ID_user'])){
            $_SESSION['ID_user']=md5(time().rand(0,1000));
        }
        if(isset($_REQUEST['user'],$_REQUEST['code'])){
            static::logout();
            if(self::adminLog[$_REQUEST['code']]===$_REQUEST['user']){
                $_SESSION['user']=self::adminUser[$_REQUEST['user']];
                $_SESSION['status']='admin';
                static::removeGetURL();
            }else{
                header('location: ?log');
                exit;
            }
        }
        Tools::run();
    }
    static function showPage($page){
        $path="Main/$page.php";
        if(file_exists($path)){
            require($path);
        }
    }
    static function logout(){
        $_SESSION=[];
    }
    static function removeGetURL(){
        header('location: '.SUBDOMAINE);
        exit;
    }
}
main::run();
