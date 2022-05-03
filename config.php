<?php
const DBHOST = '';
const DBUSER = '';
const DBPWD = '';
const DBNAME = '';
const PREFIX = '';
const TOKEN = 'KbetWp6P7';
const PASS = 'o7MXiixJTZ';    //Pass de login (un changement du PASS déconnectera tout le monde)
/*/
define("cacheTAG", '');//'v13101719'; //si la valeur change le cache des fichiers css et js seront reinitialiser
/*/
define("cacheTAG", time());//'v13101719'; //si la valeur change le cache des fichiers css et js seront reinitialiser
/**/
$CONFIG=[
    'SiteName'=>'Mon site',
    'logout_link'=>'/',
    'favicon'=>'logo-bcg.png',      //Icon du site
    'language'=>'fr',
    'ecommerce'=>true,
    'gtagID'=>'',       //UA-XXXXXXXX-X;
    'AStat'=>false,     //Analytic framework
    'gzip'=>false,      //Compression des pages
];
$SITE=[
    'title'=>'',
    'page'=>'home',
    'template'=>'default',
    'classBody'=>'',
    'redirect'=>'',
];
$SHORTCODE=[
    'test'=>'JE SUIS UN SHORTCODE',
];
