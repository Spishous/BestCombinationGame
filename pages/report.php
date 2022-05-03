<?php
if(isset($_POST['email'])){
    sendEmail($_POST['email'],$_POST['objet'],$_POST['msg']);
    $url=$_SERVER["REDIRECT_URL"];
    echo '<script>window.location.replace("'.$url.'");</script>';
}

function sendEmail($email,$objet,$msg){
    $recipient = 'rlucas974@outlook.fr;timotheegirard2@gmail.com';

    $subject = $objet;
    $message = '<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
<p>Email de l\'expéditeur : '.$email.'</p>
<p>Message : '.$msg.'</p>
</body>';
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = "From: Signalement BCG <support@bcg.com>";

    mail($recipient, $subject, $message, implode("\r\n", $headers));
}
?>

<style>
    form {display:flex;flex-direction:column;width:400px;margin:auto;max-width:90%}
    form input {margin-bottom:15px}
    form label {color:lightgrey;font-size:.8em;padding:4px}
    form textarea {width:100%;min-width:100%;resize:vertical;max-width:100%;margin-bottom:15px}
    form input, form textarea {border-radius:6px;padding:0.4em;outline:none;border:none;font-size:16px}
    button#submit {cursor: pointer;width:200px;margin:auto;padding:0.6em;border-radius:6px;border:none;font-size:14px;background:#468cd3;color:whitesmoke;font-weight:600}
</style>
<div class="main">
    <div class="container">
        <h1 style="text-align: center;">Signaler</h1>
        <br>
    </div>
    <form method="post" action="#">
        <label for="email">Email</label>
        <input type="text" id="email" required name="email" autocomplete="on">
        <label for="objet">Objet</label>
        <input type="text" id="objet" required name="objet" autocomplete="off">
        <label for="msg">Message</label>
        <textarea id="msg" name="msg" required autocomplete="off" style="height: 150px;"></textarea>
        <button id="submit">Envoyer</button>
    </form>
</div>
