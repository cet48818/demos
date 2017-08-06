// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// var extVer = "1.6.4";
// 1.6.0：添加浮动按钮；
// 1.6.1：去掉SimilarWeb的SDK；
// 1.6.2：添加日志；
// 1.6.3：增加了对html5播放器的支持；更新了网站支持列表，并针对youtube的情况调整按钮的维棠；
// 1.6.4：给log的参数加上前缀vdext，避免和url内的参数冲突；实时读取插件的版本号；


function doVidp(url, from) {
  var vidpUrl = "vidp://download/http://base64.vidown.cn/" + window.btoa(url);
  chrome.tabs.executeScript({
    code: 'var el = document.createElement("a");document.body.appendChild(el);el.target="_self";el.href = "' + vidpUrl + '";el.click();document.body.removeChild(el);'
  });
  logDownload(url, from);
}
// A generic onclick callback function.
function genericOnClick(info, tab) {
  var pageUrl;
  if (!info.linkUrl) {
    patt = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if (patt.test(info.selectionText)) {  // 如果选择的是一个url地址
      pageUrl = info.selectionText;
    }
    else {
      pageUrl = info.pageUrl;
    }
  }
  else {
    pageUrl = info.linkUrl;
  }
  // setPref("vidown_ext_chrome_id", "");
  doVidp(pageUrl, "context");
}

// Create one test item for each context type.
var title = chrome.i18n.getMessage("menuLabel");
var id = chrome.contextMenus.create({
  'type':'normal',
  "title": title,
  "contexts":["page","link","selection","editable","video","audio"],
  "onclick": genericOnClick
});
  // console.log("'" + context + "' item:" + id);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  // alert(genRandString(32));
  doVidp(tab.url, "button");
});
chrome.commands.onCommand.addListener(function(command) {
  // Call 'update' with an empty properties object to get access to the current
  // tab (given to us in the callback function).
  chrome.tabs.update({}, function(tab) {
    // if (command == 'call-vidown')
      doVidp(tab.url, "hotkey");
  });
});


// receive message from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.vidpFloatPannelMsg != "") {
      doVidp(request.vidpFloatPannelMsg, "float");
    }
    /*
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "vidpFloatPannelMsg")
       sendResponse({farewell: "goodbye"});
    */
  });
