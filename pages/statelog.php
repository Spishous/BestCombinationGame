<style>
    h1 {text-align:center;margin:0.5em}
    #listLog li {display:flex;column-gap:10px;padding:0.3em 1em}
    .log-loc {font-weight:600}
    .log-date {text-decoration:underline}
</style>
<h1>State Log</h1>
<ul id="listLog">
<?php
    $folder=$_SERVER["SCRIPT_FILENAME"];
    $folder=substr($folder,0,strrpos($folder,'/'));
    $pathfile=$folder.'/log/log.txt';
    if(!file_exists($pathfile)){
        file_put_contents($pathfile,"");
    }
    $content=substr(file_get_contents($pathfile),1);
    $tableLog=explode('#',$content);
    foreach ($tableLog as $item){
        $AItem=explode('|',$item);
        echo "<li><span class='log-date'>".$AItem[0]."</span>"."<span class='log-name'>".($AItem[1]??"(No data)")."</span>"."<span class='log-loc'>".($AItem[3]??"(No data)")."</span>"."</li>";
    }
?>
</ul>

