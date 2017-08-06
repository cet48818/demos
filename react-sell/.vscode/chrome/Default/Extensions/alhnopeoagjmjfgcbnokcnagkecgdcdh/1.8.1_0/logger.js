
	var setPref = function(key, value) {
		localStorage.setItem(key, value);
	};

	var getPref = function(key) {
		if (!localStorage[key]) {
			return "";
		}
		return localStorage[key];
		/*
		alert(key);
		*/

		/*
		var value = "";
    	chrome.storage.local.get(key, function(result){
	        value = result.vidown_ext_chrome_id;
	    });
	    return value;
	    */
	};

	var genRandString = function(string_size) {
	  	var text = "";
	  	var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	  	for (var i = 0; i < string_size; i++) {
	      	text += possible.charAt(Math.floor(Math.random() * possible.length));
	  	}
	  	return text;
	};

	var getUserId = function() {
	  	var userId = getPref("vidown_ext_chrome_id");
	  	if (userId == "") {
	  		userId = genRandString(32);
	    	setPref("vidown_ext_chrome_id", userId);
	  	}
	  	return userId;
	};

	var extVer = chrome.runtime.getManifest().version;
    var	logUrl = "http://rtlog.vidown.cn/ext/rtlog.vd?vdextbr=chrome&vdextver=" + extVer + "&vdextid=" + getUserId();

    var sendLog = function(url) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		console.log(url);
		xhr.send();
    }
    var logDownload = function(url, from) {
    	var sendUrl = logUrl + "&vdextfrom=" + from + "&vdexturl=" + url;
    	sendLog(sendUrl);
    };
    var logInit = function() {
    	var sendUrl = logUrl + "&vdexta=init";
    	sendLog(sendUrl);
    };
    logInit();
