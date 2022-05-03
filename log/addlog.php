<?php
$name="";
$ip=getRealIpAddr();
$folder=$_SERVER["SCRIPT_FILENAME"];
$folder=substr($folder,0,strrpos($folder,'/'));
$pathfile=$folder.'/log/log.txt';
if(!file_exists($pathfile)){
    file_put_contents($pathfile,"");
}
$content=file_get_contents($pathfile);
if(isset($_POST['name'])){
    $name=$_POST['name'];
}
if($name && $ip){
    if(!str_contains($content,("|".$name."|".$ip))){
        echo "saved";
        $res = fopen($pathfile,"a+");
        fwrite($res,date("#Y/m/d H:i:s")."|".$name."|".$ip."|".getCity($ip)."\n");
        fclose($res);
    }else{
        echo "already exist";
    }

}
function getCity($ip){
    $result=file_get_contents('http://ip-api.com/json/'.$ip);
    $arr=explode(',',$result);
    foreach ($arr as $section){
        $section=trim($section);
        if(str_starts_with($section,'"city"')){
            return substr($section,8,-1);
        }
    }
    return "(City not found)";
}

function getRealIpAddr()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
        $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
        $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
        $ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}
?>
