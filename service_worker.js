const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let creating; // A global promise to avoid concurrency issues

chrome.runtime.onMessage.addListener(handleMessages);

async function getGeolocation() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
  const geolocation = await chrome.runtime.sendMessage({
    type: 'get-geolocation',
    target: 'offscreen'
  });
  await closeOffscreenDocument();
  return geolocation;
}

async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  const matchedClients = await clients.matchAll();

  return matchedClients.some(c => c.url === offscreenUrl)
}

async function setupOffscreenDocument(path) {
  //if we do not have a document, we are already setup and can skip
  if (!(await hasDocument())) {
    // create offscreen document
    if (creating) {
      await creating;
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [chrome.offscreen.Reason.GEOLOCATION || chrome.offscreen.Reason.DOM_SCRAPING],
        justification: 'add justification for geolocation use here',
      });

      await creating;
      creating = null;
    }
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}