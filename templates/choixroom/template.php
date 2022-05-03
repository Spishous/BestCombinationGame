<?php
$gamelist=[
    '100'=>'Jeu du 100',
    'kantu'=>'Kantu',
    'dealer'=>'Jeu du dealer',
    'limit-limit'=>'Limite Limite',
    'pyramid'=>'Jeu de la pyramide',
    'never-have-i-ever'=>"Je n'ai jamais",
    'multiplayer-zone'=>"Zone Multijoueur"
    ];
if(!isset($_GET['game']) || !isset($gamelist[$_GET['game']])){
    header('Location: : ./..');
    exit();
}
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Choix room</title>
    <link rel="stylesheet" href="/assets/css/avatar.css">
    <link rel="stylesheet" href="./template.css">
    <link rel="stylesheet" href="/assets/css/style-default.css">
    <link rel="stylesheet" href="/assets/css/font-icon.css">
    <script src="/assets/js/avatar.js"></script>
    <script src="/assets/js/jquery.js"></script>
    [meta]
</head>
<body>
<div class="extra-design">
    <span class="bubble1"></span>
</div>
<h1><?=$gamelist[$_GET['game']]?></h1>
<div id="content">
    [content]
</div>
</body>
</html>
