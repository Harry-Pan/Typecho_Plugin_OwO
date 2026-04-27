<?php 
/**
 * Action.php
 * 
 * 处理请求
 * 
 * @author HarryPan
 */
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
?>

<?php 

		class OwOPackage{
	        public $type;
	        public $icon;
	        public $container;
	        function __OwOPackage(){
	        	$container=array();
	        }
	    }
		class OwOItem{
			public $icon;
			public $data;
			public $text;
			public $type;
			function __OwOItem($icon,$data,$text,$type){
				$this->icon=$icon;
				$this->data=$data;
				$this->text=$text;
				$this->type=$type;
			}
		}
class Typecho_Plugin_OwO_Action extends Widget_Abstract_Contents implements Widget_Interface_Do
{
    /**
     * 返回请求的 JSON
     * 
     * @access public
     */
    public function action(){
        // 要求先登录
        Typecho_Widget::widget('Widget_User')->to($user);
        if (!$user->have() || !$user->hasLogin()) {
            echo 'Invalid Request';
            exit;
        }

        if($_GET['action']=='rebuild') {
                self::rebuild();
?>
                重建索引完成，<a href="<?php Helper::options()->siteUrl(); ?>" target="_self">回到首页</a>。
<?php
        }
    }
    public static function rebuild(){
//     	$oldjson=json_decode(file_get_contents('./usr/plugins/Typecho_Plugin_OwO/owo/list.json'));
        $oldjson=null;
	    $dir = './usr/plugins/Typecho_Plugin_OwO/owo/biaoqing/';
		$files = scandir($dir);
	 	$json=new stdClass();
	 	if($oldjson==null){
	 		$oldjson=new stdClass();
	 	}
	 	$oldjsonarray = get_object_vars($oldjson);
	 	foreach ($oldjsonarray as $name => $package){
	 		if($package->type=="emoticon"){
	 			$json->{$name}=$oldjson->{$name};
	 			echo '"'.$name.'"已作为颜文字写入。<br>';
	 		}
	 	} 





		foreach ($files as $file) {
		    if ($file != '.' && $file != '..') {
		        // echo $file . '<br>';
		        if($oldjson->{$file}!=null){
		        	echo '"'.$file.'"已存在。<br>';
		        	$json->{$file}=$oldjson->{$file};
		        	continue;
		        }
		        $json->{$file}=new OwOPackage();
		        $json->{$file}->container=array();
		        $json->{$file}->type="image";
		        $json->{$file}->icon="<img style=\"width: 30px;height: 30px;object-fit:contain;margin: 5px 5px 0 0;\" src=\"/usr/plugins/Typecho_Plugin_OwO/owo/biaoqing/".$file."/icon.png\">";
		        $owodir=$dir.$file;
		        echo $owodir;
		        $owos=scandir($owodir);
		        foreach ($owos as $owo) {
				    if ($owo != '.' && $owo != '..') {
				        // echo $owo . '<br>';
				        if($owo!="icon.png"){
					        $item=new OwOItem();
					        $item->icon="<img class=\"biaoqing\" data-src=\"/usr/plugins/Typecho_Plugin_OwO/owo/biaoqing/".$file."/".$owo."\">";
					        $item->text=substr($owo,0,strrpos($owo,'.'));
					        $item->data='[owo_'.$file.'_'.$item->text.']';
					        $item->type=substr($owo,strrpos($owo,'.'),-1);
					        array_push($json->{$file}->container,$item);
// 					        $oldname=$owodir.'/'.$owo;
// 					        $newname=$owodir.'/'.$owo;
// 					        echo $oldname.'<br>-已转换为：'.$newname.'<br>';
// 					        rename($oldname,$newname);
					    }
				    }
				}
			}
	    }
	    $encode=json_encode($json);
	    // echo $encode;
	    file_put_contents("./usr/plugins/Typecho_Plugin_OwO/owo/list.json", $encode);
	    echo '<br>';
	}
}