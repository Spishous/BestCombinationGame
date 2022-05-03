<head>
    <meta charset="UTF-8">
    <link rel="icon" href="/assets/src/logo-bcg.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="/assets/css/login.css?<?=time()?>">
    <link rel="stylesheet" href="/assets/css/style-default.css">
</head>
<body>
<div class="extra-design">
    <span class="bubble1"></span>
</div>
<main>
    <h1>Login</h1>
<form class="form-login" method="post">
    <div class="group-form">
        <label for="user">User</label>
        <input type="text" id="user" name="user" autocomplete="off" required>
    </div>
    <div class="group-form">
        <label for="pwd">Password</label>
        <input type="number" id="pwd" name="code"  pattern="\d*" required autocomplete="off" min="1000" max="9999">
    </div>
    <button type="submit" id="btnLog">Se connecter</button>
    <br>
    <a href="/">Retour à l'accueil</a>
</form>
</main>
<script>
    document.querySelector('input#pwd').addEventListener('keypress',function(e){
        if(this.value.length>3){
            e.preventDefault();
            this.blur();
        }
    })
    document.querySelector('input#pwd').addEventListener('keyup',function(e){
        if(this.value.length==4){
            this.blur();
        }
    })
    document.addEventListener('keydown',function(e){
       if(e.key==="Enter"){
            let form=new FormData(document.querySelector('form'));
            if(form.get('code').length==4 && form.get('user').length>2){
                document.querySelector('form').submit();
            }
       }
    })
</script>
</body>
