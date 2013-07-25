function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.url != "")
      focusOrCreateTab(request.url);
  });

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "charmin_tp2_redirect")
      sendResponse({status: localStorage['charmin_tp2_redirect']});
    else
      sendResponse({}); // snub them.
});