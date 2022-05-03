<?php
namespace Tools;
header('Content-Type: text/html;charset=UTF-8');
@session_start();
require_once "config.php";
require_once "route.php";

//error_reporting(0);
$ip=$_SERVER['SERVER_NAME'];
if($ip=='localhost'){
    $ip=gethostbynamel(getHostName());
    $ip=end($ip);
}
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? 'https://' : 'http://';
define('DOMAINE', $protocol.$ip);
$subdomaine = substr($_SERVER['PHP_SELF'], 0, strrpos($_SERVER['PHP_SELF'], "/"));
$subdomaine=str_replace(' ','%20',$subdomaine);
define('SUBDOMAINE', $subdomaine);
$currenturl=$_SERVER['REQUEST_URI'];
if(strpos( $currenturl, SUBDOMAINE."/")!==NULL)  $currenturl=substr( $currenturl,strlen(SUBDOMAINE));
if(strrpos( $currenturl, "?"))  $currenturl=substr( $currenturl, 0,strrpos( $currenturl, "?")-strlen( $currenturl));
if(strrpos( $currenturl, "/")==strlen( $currenturl)-1)  $currenturl=substr( $currenturl,0,strlen( $currenturl)-1);
define('currenturl',$currenturl);
$URLredirect="";
if(strpos($_SERVER["REQUEST_URI"],'/?')){
    $URLredirect=str_replace('/?','?',$_SERVER["REQUEST_URI"]);
}elseif(str_ends_with($_SERVER["REQUEST_URI"],'/')){
    $URLredirect=substr($_SERVER["REQUEST_URI"],0,-1);
}
$query=(strpos($URLredirect,'?'))?substr($URLredirect,strpos($URLredirect,'?')):'';
if($URLredirect && ($URLredirect!=SUBDOMAINE.$query && $URLredirect!=SUBDOMAINE.'/'.$query)){
    header('Location:'.$URLredirect);
    exit();
}

function check($path=""){
    return (currenturl===$path);
}
function has($path=""){
    return str_starts_with(currenturl, $path);
}

class DB{
    var $defaultDebug = false;
    var $mtStart;
    var $nbQueries;
    var $lastResult;
    var $link;

    function __construct($server=DBHOST, $user=DBUSER, $pass=DBPWD, $base=DBNAME, $error=1){
        $this->mtStart = $this->getMicroTime();
        $this->nbQueries = 0;
        $this->lastResult = NULL;
        if($error){
            $this->link = @mysqli_connect($server, $user, $pass) or die("error connect BDD");
            @mysqli_select_db($this->link, $base) or die("error connect datatable");
        }else{
            $this->link = @mysqli_connect($server, $user, $pass) or function(){return false;};
            @mysqli_select_db($this->link, $base) or function(){return false;};
        }
    }

    function query($query, $debug = -1,$error=0){
        $this->nbQueries++;
        $this->lastResult = mysqli_query($this->link, $query) or ($this->debugAndDie($query,$error));

        $this->debug($debug, $query, $this->lastResult);
        return $this->lastResult;
    }

    function execute($query, $debug = -1,$error=0){
        $this->nbQueries++;
        mysqli_query($this->link, $query) or ($this->debugAndDie($query,$error));

        $this->debug($debug, $query);
    }

    function fetchNextObject($result = NULL){
        if ($result == NULL)
            $result = $this->lastResult;

        if ($result == NULL || mysqli_num_rows($result) < 1)
            return NULL;
        else
            return mysqli_fetch_object($result);
    }

    function numRows($result = NULL){
        if ($result == NULL) return mysqli_num_rows($this->lastResult);
        else return mysqli_num_rows($result);
    }

    function queryUniqueObject($query, $debug = -1){
        $query = "$query LIMIT 1";
        $this->nbQueries++;
        $result = mysqli_query($this->link, $query) or $this->debugAndDie($query);
        $this->debug($debug, $query, $result);
        return mysqli_fetch_object($result);
    }

    function queryUniqueValue($query, $debug = -1){
        $query = "$query LIMIT 1";
        $this->nbQueries++;
        $result = mysqli_query($this->link, $query) or $this->debugAndDie($query);
        $line = mysqli_fetch_row($result);
        $this->debug($debug, $query, $result);
        return $line[0];
    }

    function maxOf($column, $table, $where){
        return $this->queryUniqueValue("SELECT MAX(`".$column."`) FROM `".$table."` WHERE ".$where);
    }

    function maxOfAll($column, $table){
        return $this->queryUniqueValue("SELECT MAX(`".$column."`) FROM `".$table."`");
    }

    function countOf($table, $where){
        return $this->queryUniqueValue("SELECT COUNT(*) FROM ".$table." WHERE ".$where);
    }

    function countOfAll($table){
        return $this->queryUniqueValue("SELECT COUNT(*) FROM ".$table);
    }

    function debugAndDie($query,$error=1){
        if($error){
            $this->debugQuery($query, "Error");
            $GLOBALS["ERRORSQL"] = mysqli_error($this->link);
        }
        return true;
    }

    function debug($debug, $query, $result = NULL){
        if ($debug === -1 && $this->defaultDebug === false) return;
        if ($debug === false) return;

        $reason = ($debug === -1 ? "Default Debug" : "Debug");
        $this->debugQuery($query, $reason);
        if ($result == NULL) echo "<p style=\"margin: 2px;\">Number of affected rows: " . mysqli_affected_rows($this->link) . "</p></div>";
        else $this->debugResult($result);
    }

    function debugQuery($query, $reason = "Debug"){
        $color = ($reason == "Error" ? "red" : "orange");
        echo "<div style=\"border: solid $color 1px; margin: 2px;\">" .
            "<p style=\"margin: 0 0 2px 0; padding: 0; background-color: #DDF;\">" .
            "<strong style=\"padding: 0 3px; background-color: $color; color: white;\">$reason:</strong> " .
            "<span style=\"font-family: monospace;\">" . htmlentities($query) . "</span></p>";
    }

    function debugResult($result){
        echo "<table border=\"1\" style=\"margin: 2px;\">" .
            "<thead style=\"font-size: 80%\">";
        $numFields = mysqli_num_fields($result);
        // BEGIN HEADER
        $tables = array();
        $nbTables = -1;
        $lastTable = "";
        $fields = array();
        $nbFields = -1;
        while ($column = mysqli_fetch_field($result)) {
            if ($column->table != $lastTable) {
                $nbTables++;
                $tables[$nbTables] = array("name" => $column->table, "count" => 1);
            } else
                $tables[$nbTables]["count"]++;
            $lastTable = $column->table;
            $nbFields++;
            $fields[$nbFields] = $column->name;
        }
        for ($i = 0; $i <= $nbTables; $i++)
            echo "<th colspan=" . $tables[$i]["count"] . ">" . $tables[$i]["name"] . "</th>";
        echo "</thead>";
        echo "<thead style=\"font-size: 80%\">";
        for ($i = 0; $i <= $nbFields; $i++)
            echo "<th>" . $fields[$i] . "</th>";
        echo "</thead>";
        // END HEADER
        while ($row = mysqli_fetch_array($result)) {
            echo "<tr>";
            for ($i = 0; $i < $numFields; $i++)
                echo "<td>" . htmlentities($row[$i]) . "</td>";
            echo "</tr>";
        }
        echo "</table></div>";
        $this->resetFetch($result);
    }

    function getExecTime(){
        return round(($this->getMicroTime() - $this->mtStart) * 1000) / 1000;
    }

    function getQueriesCount(){
        return $this->nbQueries;
    }

    function resetFetch($result){
        if (mysqli_num_rows($result) > 0)
            mysqli_data_seek($result, 0);
    }

    function lastInsertedId(){
        return mysqli_insert_id($this->link);
    }

    function close(){
        mysqli_close($this->link);
    }

    function getMicroTime(){
        list($msec, $sec) = explode(' ', microtime());
        return floor($sec / 1000) + $msec;
    }
}

class Tools {
    public $SITE;
    protected $CONFIG;
    protected $PARAMS;
    protected $SQL;

    public function __construct()
    {
        $this->CONFIG=static::get_CONFIG();
        $this->SITE=static::get_SITE();
        //$this->SQL = new DB();

        if(isset($_GET["logout"])) $this->redirect_logout($this->CONFIG['logout_link']);
        if(!(isset($_SESSION["log"]) && $_SESSION["log"])){
            $this->SITE["log"]=false;
        }
        else{
            $this->SITE["log"]=true;
            $this->SITE["classBody"].=" log";
        }
        if(!($this->SITE["log"] && $_SESSION["token"]==PASS && $_SESSION["statut"]>=200)){$this->SITE["log_admin"]=false;}
        else{$this->SITE["log_admin"]=true;}

        $this->PARAMS['meta']=(($this->CONFIG['favicon'])?"<link rel='icon' href='".SUBDOMAINE."/assets/src/".$this->CONFIG['favicon']."' type=\"image/x-icon\">":"");
//        $this->PARAMS['meta'].='<link rel="preload" href="'.SUBDOMAINE.'/content/assets/webfonts/fa-solid-900.woff2" as="font" type="font/woff2" crossorigin="anonymous">
//            <link rel="preload" href="'.SUBDOMAINE.'/content/assets/webfonts/fa-regular-400.woff2" as="font" type="font/woff2" crossorigin="anonymous">
//            ';//<link rel="preload" href="'.SUBDOMAINE.'/content/assets/webfonts/fa-brands-400.woff2" as="font" type="font/woff2" crossorigin="anonymous">';
        if(!$this->SITE["log_admin"] && $this->SITE['in_Editor']===false){
            if($this->CONFIG['gtagID']) $this->PARAMS['meta'].="<script async src=\"https://www.googletagmanager.com/gtag/js?id=".$this->CONFIG['gtagID']."\"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '".$this->CONFIG['gtagID']."');
            </script>";

        }
        if($this->CONFIG['AStat']) $this->PARAMS['meta'].='<script id="stateAnalytics" log="'.((@$this->SITE["log"])?"1":"0").'" src="'.SUBDOMAINE.'/content/assets/lib/state.js"></script>';
    }
    public static function run(){
        $route=\route::run();
        $tools=new Tools();
        if($route['template'])$tools->SITE['template']=$route['template'];
        if($route['title'])$tools->SITE['title']=$route['title'];
        if($route['page'])$tools->SITE['page']=$route['page'];
        $tools->showConvertSc('templates/'.$tools->SITE['template'].'/template.php');
    }

    public static function get_SITE($key=''){
        global $SITE;
        if($key==''){
            $SITE['in_Editor'] = (isset($SITE['in_Editor'])? $SITE['in_Editor'] : false);
            $SITE['log_admin']=false;
            $SITE['log']=false;
            return $SITE;
        }else{
            if(isset($SITE[$key])){
                return $SITE[$key];
            }else{
                return false;
            }
        }
    }
    public static function get_CONFIG($key=''){
        global $CONFIG;
        if($key==''){
            return $CONFIG;
        }else{
            if(isset($CONFIG[$key])){
                return $CONFIG[$key];
            }else{
                return false;
            }
        }
    }
    public static function get_SHORTCODE($key=''){
        global $SHORTCODE;
        if($key==''){
            return $SHORTCODE;
        }else{
            if(isset($SHORTCODE[$key])){
                return $SHORTCODE[$key];
            }else{
                return false;
            }
        }
    }

    /**
     * @param string $logout_link
     */
    public function redirect_logout($logout_link=""){//Redirection après decconexion
        if (intval($_GET["logout"])>1000&&(intval($_GET["logout"]) % 2)==1) {
            session_destroy();
            if($logout_link!=""){
                $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
                    || $_SERVER['SERVER_PORT'] == 443) ? 'https://' : 'http://';
                header('Location: ' . $protocol . $_SERVER['HTTP_HOST'] . SUBDOMAINE.$logout_link);exit;
            }else{
                $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
                    || $_SERVER['SERVER_PORT'] == 443) ? 'https://' : 'http://';
                header('Location: ' . $protocol . $_SERVER['HTTP_HOST'] . strtok($_SERVER["REQUEST_URI"], '?'));exit;
            }
        }}
    public static function noSpecialCharacter($string){//Verifie si ne text ne presente aucun caractere special
        if(preg_match('/[\'\"^£%&*()}{#~?><>,|=+¬\[\]]/', $string)) return false;
        else return true;
    }
    function cache($strcache){//Ajoute le systeme de cache a tout les fichiers liés
        if(cacheTAG!=''){$lc=strlen(cacheTAG);
            preg_match_all('/(\.css\")/im',$strcache, $matches, PREG_OFFSET_CAPTURE);
            for($i=0,$size=sizeof($matches[0]);$i<$size;$i++){$strcache = substr_replace($strcache, "?v=".cacheTAG,($matches[0][$i][1])+((3+$lc)*($i+1)-$lc+1), 0);}
            preg_match_all('/(\.js\")/im',$strcache, $matches, PREG_OFFSET_CAPTURE);
            for($i=0,$size=sizeof($matches[0]);$i<$size;$i++){$strcache = substr_replace($strcache, "?v=".cacheTAG,($matches[0][$i][1])+((3+$lc)*($i+1)-$lc), 0);}
        }return $strcache;
    }

    function convertSc($path){
        if(file_exists($path)){
            $str=file_get_contents($path);
        }
        elseif(str_starts_with($path,'./pages')){
            if(file_exists($path.'.php')){
                $path=$path.'.php';
            }elseif(file_exists($path.'.html')){
                $path=$path.'.html';
            }else{
                $path='./pages/404.php';
            }
            $str=file_get_contents($path);
        }else{
            return false;
        }
        if($str!=null) {
            $str = str_replace('src="/', 'src="' . SUBDOMAINE . '/', $str);
            $str = str_replace('href="/', 'href="' . SUBDOMAINE . '/', $str);
            $str = str_replace('link="/', 'link="' . SUBDOMAINE . '/', $str);
            $str = str_replace("url('/", "url('" . SUBDOMAINE . '/', $str);
            $str = str_replace('src="./', 'src="/' . substr($path,0,strrpos($path,'/')) . '/', $str);
            $str = str_replace('href="./', 'href="/' . substr($path,0,strrpos($path,'/')) . '/', $str);

            preg_match_all('/\[shortcode [^.+$\]\[()]*\]/mi', $str, $matches);
            if($size=sizeof($matches[0])){
                $shortcode=static::get_SHORTCODE();
                for($i = 0, $size; $i < $size; $i++) {
                    $code = substr($matches[0][$i], 11, -1);
                    if(isset($shortcode[$code])){
                        $str = str_replace($matches[0][$i],$shortcode[$code],$str);
                    }
                }
            }
            $shortcode=array(
                '[template]'    => $this->SITE["template"],
                '[page]'    => $this->SITE["page"],
                '[title]'   => $this->SITE["title"],
                '[href-logout]' => '"?logout=<?= 1001+(2*rand(1, 2000))?>"',
                '[class-body]'   => $this->SITE["classBody"],
                '[meta]'    => $this->PARAMS['meta'],
                '[header]'  => '<?php $this->showConvertSc("./templates/'.$this->SITE["template"].'/header.php") ?>',
                '[footer]'  => '<?php $this->showConvertSc("./templates/'.$this->SITE["template"].'/footer.php") ?>',
                '[content]' => '<?php $this->showConvertSc("./pages/'.$this->SITE["page"].'") ?>',
            );
            foreach ($shortcode as $k => $v) {
                $str = str_replace($k, $v, $str);
            }
            $str=str_replace('href="'.$_SERVER["REQUEST_URI"].'"','href="'.$_SERVER["REQUEST_URI"].'" currentURL',$str);
            return $str;
        }else{
            return false;
        }
    }
    public function showConvertSc($str){
        $content= $this->convertSc($str);
        $content= $this->cache($content);
        if($content){
            eval(sprintf("?>%s<?php ", $content));
            return true;
        }else{
            return false;
        }
    }
}

define('version','1.0.1');
?>
