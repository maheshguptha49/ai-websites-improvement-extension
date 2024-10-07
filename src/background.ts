import { WorkerEvents } from "./types";
import { handleSitemapFetch } from "./workers/sitemapworker";

console.log("background file running");
interface MessageRequest {
  action: string;
}

chrome.runtime.onMessage.addListener(
  (request: MessageRequest, sender, sendResponse) => {
    if (request.action === WorkerEvents.FETCH_SITEMAP) {
      console.log("request came to background.js");

      handleSitemapFetch()
        .then((result) => sendResponse(result))
        .catch((error) => sendResponse({ error: error.message }));

      // Return true to indicate that the response is sent asynchronously
      return true;
    }
  }
);
