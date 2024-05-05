/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    chrome.action.onClicked.addListener(function () {
      chrome.windows.create({
        focused: true,
        width: 600,
        height: 1200,
        type: "popup",
        url: "popup.html",
        top: 0,
        left: 0
      });
      // chrome.tabs.create({url: 'popup.html'});
    });
    
    console.log("background is active");
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.action === 'SendUrl') {
        getCurrentTabURL(function (url, id) {
          console.log('Current URL:', url);
          console.log('Current id ', id);
          setTimeout(() => {
            chrome.runtime.sendMessage({
              action: 'sendURL',
              url: url,
              id: id
            });
          }, 5000);
        });
      }
    });
    function getCurrentTabURL(callback) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        const url = tabs[0].url;
        const id = tabs[0].id;
        callback(url, id);
      });
    }
    
    //For Feedback Form
    chrome.runtime.onInstalled.addListener(details => {
        if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
            chrome.runtime.setUninstallURL("https://forms.gle/SA7shHbtMaFYczxv7");
        }
      });
    })();