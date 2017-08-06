var g_bClosed = false;
var g_vdDiv = null;
var g_srcElement = null;
var g_timer = null;
var g_player = null;
var g_elementUrl = null;
var g_config = {config:[
	{
		site: "general",
		id: "",
		data: "",
		element: "video"
	},
	/*
	{
		site: "youku",
		id: "movie_player",
		data: "youku.com"
	},
	{
		site: "PPTV",
		id: "PPTV_PLAYER",
		data: "pplive.cn"
	},
	*/
	{
		site: "tencent",
		id: "tenvideo_flash_player",
		data: "tencentvideo",
		element: "page"
	},
	{
		site: "le",
		id: "www_player_1",
		data: "letvcdn.com",
		element: "page"
	},
	{
		site: "mgtv",
		id: "hunantv-player-1",
		data: "MangoTV",
		element: "page"
	},
	{
		site: "wasu",
		id: "wsplayer",
		data: "wasu.cn",
		element: "page"
	},
	{
		site: "baofeng",
		id: "playg8rjst",
		data: "baofeng.com",
		element: "page"
	},
	{
		site: "bilibili",
		id: "player_placeholder",
		data: "hdslb.com",
		element: "page"
	},
	{
		site: "ku6",
		id: "ku6player",
		data: "ku6cdn.com",
		element: "page"
	},
	/*
	{
		site: "weibo",
		id: "",
		// http://ask.ivideo.sina.com.cn/v_play_ipad.php?vid=141744681&amp;tags=weibocard
		// http://us.sinaimg.cn/002jAggYjx079oi6nmdG0104010073ED0k01.mp4?label=mp4_hd&amp;Expires=1489208661&amp;ssig=aSYaKBFZT2&amp;KID=unistore,video
		data: "v_play_ipad",
		element: "player"
	},
	*/
	{
		site: "tangdou",
		id: "SwfObject",
		data: "bokecc.com",
		element: "page"
	},
	{
		site: "cctv",
		id: "vplayer",
		data: "cntv.cn",
		element: "page"
	},
	{
		site: "sohu",
		id: "player",
		data: "sohu.com",
		element: "page"
	},
	{
		site: "youtube",
		id: "",
		data: "youtube.com",
		element: "page"
	}
	/*
	{
		// 以iframe的形式内嵌优酷播放器 http://6pingm.com/dfwshlxjr/149677.html
		// 在iframe内部捕捉不到mousemove
		id: "youku-player",
		data: "youku.com",
		obj: "data"				
	},
	*/
]};

var g_config_index = -1;

// function getVersion() {
//     var version = 'NaN';
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
//     xhr.send(null);
//     var manifest = JSON.parse(xhr.responseText);
//     return manifest.version;
// }

// function httpRequest(url, callback){
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             callback(xhr.responseText);
//         }
//     }
//     xhr.send();
// }

function doVidp(url) {
 	var vidpUrl = "vidp://download/" + url;
	var el = document.createElement("a");
	document.body.appendChild(el);
	el.href = vidpUrl;
	el.click();
	document.body.removeChild(el);
}

function getDownloadUrl() {
	var vidpUrl = "";
	// 点击的时候，g_srcElement是浮动按钮，其父节点才是播放器（H5或者swf）
	// console.log("player: " + g_player.innerHTML + "; type: " + g_player.type + "; tagName: " + g_player.tagName + ";");
	// console.log("config index: " + g_config_index + "; element: " + g_config.config[g_config_index].element);
	// 如果是我们支持的网站，并且element为page，则取当前网址作为要下载的地址
	if (g_config_index >= 0 && g_config.config[g_config_index].element == "page") {
		// window.location.href;
		// 要取当前页面地址：什么都不用干，后面判断为空就直接用页面地址了
	}

	// 否则取当前元素的地址（swf的object，或者是video的src）
	else if (g_player.type == "application/x-shockwave-flash") {
		// flash
		// console.log(g_srcElement.parentNode.innerHTML);
		// console.log("player is swf");
	}

	else if (g_player.tagName.toLowerCase() == "video") {
		// html5
		vidpUrl = g_player.getAttribute("src");
		// console.log("got src of video: " + vidpUrl);
		if (vidpUrl == null) {
			// http://videojs.com/
			// 这个h5的video，没有src，但是在children里列出了多个source
			var children = g_player.children;
			for(var i = 0; i < children.length; i++) { 
				if (children[i].getAttribute("type") == "video/mp4") {
					// console.log("found video object: " + children[i]);
					vidpUrl = children[i].getAttribute("src");
					break;
				}
				// console.log(children[i]);
			} 
		}
	}

	if (vidpUrl == "") {
		vidpUrl = window.location.href;
	}

	return vidpUrl;
}

function hideFloatPanel() {
	g_vdDiv.style.display = "none";		// 确保按钮是隐藏的
}

function checkShowFloatPanel(e) {
	if (!e) {
	 	e = window.event;
	}
	else {
		e.srcElement = e.target;
	}

	if (g_srcElement == e.srcElement) {
		// 一直是这个element，后面都不用动，保持状态就可以了
		return;
	}

	// 记录当前元素（无论是否视频播放器）
	g_srcElement = e.srcElement;

	if (g_bClosed == true) {
		// 用户点击了关闭按钮
		hideFloatPanel();
		return;
	}

	if ((e.srcElement.type != "application/x-shockwave-flash") && (e.srcElement.tagName.toLowerCase() != "video") && e.srcElement.parentNode.tagName.toLowerCase() != "video") {
		// 鼠标移出区域里，不马上隐藏；由定时器负责隐藏
		// hideFloatPanel();
		// console.log("not video player");
		return;
	}
	// 判断一下是否是我们能够支持下载的（通过json数据）：
	// 支持的条件：
	// 1. 如果是video标签，则都支持
	// 2. 如果是flash：
	// 	该元素的父节点的innerHTML是否包含了配置中指定的特征字符串？
	// 	另外，如果该配置中还指定了id，则还要判断id是否能匹配。
	var bSupport = false;
	var i = 0;
	// console.log("element: " + e.srcElement.tagName + "; id: " + e.srcElement.id + "..");
	if (e.srcElement.tagName.toLowerCase() == "video") {
		bSupport = true;
		g_player = e.srcElement;
	}
	else if (e.srcElement.parentNode.tagName.toLowerCase() == "video") {
		bSupport = true;
		g_player = e.srcElement.parentNode;
	}
	else {
		// 第0个config是针对h5的
		for (i = 1; i < g_config.config.length; ++i) {
			if (e.srcElement.parentNode.innerHTML.indexOf(g_config.config[i].data) < 0) {
				continue;
			}
			// 如果没有id的话就不用判断id是否相等了
			if (!e.srcElement.id || e.srcElement.id.indexOf(g_config.config[i].id) >= 0) {
				bSupport = true;
				g_player = e.srcElement;
				g_config_index = i;
				break;
			}
		}
	}

	if (!bSupport) {
		// hideFloatPanel();
		// console.log("not support");
		return;
	}

	// 如果支持下载，则首先用全局变量记录相关信息
	// console.log(e.srcElement.id + e.srcElement.tagName + e.srcElement.innerHTML + e.srcElement.parentNode.innerHTML);
	// 然后显示按钮
	g_player.parentNode.appendChild(g_vdDiv);

	/*
	// 修改 fix pos
	var flashPos = g_player.getBoundingClientRect();
	var vdDivPos = g_vdDiv.getBoundingClientRect();
	// 按钮大小：122×26
	var btnWidth = 122;	// g_vdDiv.offsetWidth
	var btnHeight = 26; // g_vdDiv.offsetHeight
	g_vdDiv.style.left = parseInt(flashPos.right - btnWidth)	 + "px";
	g_vdDiv.style.top = parseInt(flashPos.top - btnHeight) + "px";
	console.log("player rect: (" + flashPos.left + ", " + flashPos.top + ", " + flashPos.right + ", " + flashPos.bottom + ")");
	// console.log("div size: " + g_vdDiv.offsetWidth + "x" + g_vdDiv.offsetHeight);
	// console.log("div rect: (" + vdDivPos.left + ", " + vdDivPos.top + ", " + vdDivPos.right + ", " + vdDivPos.bottom + "), global top: " + g_vdDiv.style.top);
	console.log("position: (" + g_vdDiv.style.left + ", " + g_vdDiv.style.top + ")");
	if (parseInt(g_vdDiv.style.top) < 50) {
		// 针对youtube的情况
		console.log("top is too small");
		g_vdDiv.style.top = flashPos.top + "px";
		g_vdDiv.style.left = flashPos.right + "px";
	}
	// 显示
	g_vdDiv.style.display = "block";
	// */

			//*
			if (g_bClosed == false)
			{
				// console.log("show in checkShowFloatPanel");
				g_vdDiv.style.display = "block";
			}

			// 修改 fix pos
			var flashPos = g_player.getBoundingClientRect();
			var vdDivPos = g_vdDiv.getBoundingClientRect();
			g_vdDiv.style.left = flashPos.right - vdDivPos.width + "px";
			g_vdDiv.style.top = flashPos.top - vdDivPos.height + "px";
			if (parseInt(g_vdDiv.style.top) < 50) {
				// 针对youtube的情况
				// g_vdDiv.style.top = flashPos.top + "px";
				g_vdDiv.style.top = "50px";
				g_vdDiv.style.left = flashPos.right + "px";
			}
			// */

}

function installVdFloatPanel() {

	g_pageUrl = window.location.href;
	if (g_vdDiv == null) {
		g_vdDiv = document.createElement("div");
		g_vdDiv.id = "vidown_float_panel_div";
		g_vdDiv.innerHTML = '<a id="vidown_float_panel_download" title="用【维棠】下载视频">维棠下载</a><span id="vidown_float_panel_sep">|</span><input type="button" value=" " id="vidown_float_panel_close" title="关闭"></input>';
		g_vdDiv.style.display = "none";
		document.body.appendChild(g_vdDiv);

		var btnDownload = document.getElementById("vidown_float_panel_download");
		var btnClose = document.getElementById("vidown_float_panel_close");

		btnDownload.onclick = function() {
			var vidpUrl = getDownloadUrl();
			console.log("vidpUrl: " + vidpUrl);
			// doVidp(vidpUrl);
			chrome.runtime.sendMessage({vidpFloatPannelMsg: vidpUrl});
		};

		btnClose.onclick = function() {
			g_bClosed = true;
			g_vdDiv.style.display = "none";
		};	
	}

	document.body.onmousemove = function(e) {
		checkShowFloatPanel(e);
	}
}

window.addEventListener("load", function(){
	g_bClosed = false;

	// 应该在chrome启动的时候请求一次配置，而不是每次加载页面的时候都请求一次。相关数据保存到localstorage
	// var version = "1.4.4"; //getVersion();
	// console.log(version);
	// httpRequest('http://v.pi58.com/player/getplayerconfig.php?ver=' + version, function(result){
	//     g_config = JSON.parse(result);
	//     console.log(g_config.config);
	// });

	// 从localstorage读取配置信息
	//g_config.config = localStorage.getItem("config");
	//console.log(g_config.config);
});

// 会不会起很多定时器，影响效率？？？
setInterval(function() {
	if (g_bClosed == true || g_vdDiv == null || g_srcElement == null)
		return;

	if ((g_srcElement.parentNode == g_vdDiv.parentNode && g_vdDiv.parentNode.tagName.toLowerCase() != "body")
	  || g_srcElement == g_vdDiv
	  || g_srcElement.id == "vidown_float_panel_div"
	  || g_srcElement.parentNode.id == "vidown_float_panel_div"
	  || g_srcElement.type == "application/x-shockwave-flash"
	  ) {
		// console.log("show in timer: src: "+g_srcElement.id+", div: "+g_vdDiv.id+", parent: "+g_vdDiv.parentNode.tagName);
		g_vdDiv.style.display = "block";
	}
	else {
		hideFloatPanel();
	}	
}, 1500);

function addExtId() {
	var b = document.body; 
	var e =document.createElement("div");
	e.setAttribute("id", "Vidown_extension_alhnopeoagjmjfgcbnokcnagkecgdcdh");
	e.style.display = "none";
	b.appendChild(e);
}

addExtId();
installVdFloatPanel();
