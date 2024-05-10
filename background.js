/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
chrome.action.onClicked.addListener(function () {
  chrome.windows.create({
    focused: true,
    width: 700,
    height: 1200,
    type: "popup",
    url: "popup.html",
    top: 0,
    left: 0
  });
  // chrome.tabs.create({url: 'popup.html'});
});

//For Feedback Form
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL("https://forms.gle/SA7shHbtMaFYczxv7");
    }
  });
})();