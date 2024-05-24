//For Feedback Form when being deleted
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.runtime.setUninstallURL("https://forms.gle/SA7shHbtMaFYczxv7");
  }
});

async function fetchApiKey(retries = 5, delay = 1000) {
  try {
      const response = await fetch('https://lecturesurfers-videos.s3.us-west-1.amazonaws.com/apiKey.json');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      chrome.storage.local.set({ apiKey: data.apiKey });
      return data.apiKey;
  } catch (error) {
      if (retries === 0) {
          console.error('Failed to fetch API key after multiple attempts:', error);
          return null;
      }
      console.error(`Retrying to fetch API key. Attempts remaining: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchApiKey(retries - 1, delay);
  }
}

// Fetch API key when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  fetchApiKey();
});

// Fetch API key when the extension is started
chrome.runtime.onStartup.addListener(() => {
  fetchApiKey();
});