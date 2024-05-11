//For Feedback Form when being deleted
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.runtime.setUninstallURL("https://forms.gle/SA7shHbtMaFYczxv7");
  }
});