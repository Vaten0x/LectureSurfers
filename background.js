//For Feedback Form
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.runtime.setUninstallURL("https://forms.gle/SA7shHbtMaFYczxv7");
  }
});