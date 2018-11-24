//
chrome.runtime.onInstalled.addListener(function () {
    //
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.windows.create({
            "url": chrome.runtime.getURL("popup.html"),
            "width": 600,
            "height": 150,
            "focused": true,
            "type": "popup"
        }, function (win) {
            // win represents the Window object from windows API
            // Do something after opening
            // alert('popup loaded');
        });
    });
    //
    // chrome.runtime.onMessage.addListener(function (msg, origin, response) { console.log(msg, origin); });
});