import * as ReactDOM from "react-dom/client";
import Button from "./UiKit/Button";
import { WorkerEvents } from "./types";

const Popup = () => {
  const startAnalysingSitemap = () => {
    // Send a message from the popup to the content script.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: WorkerEvents.START_SEO_ANALYSIS },
          (response) => {
            console.log("Received response from content.js: ", response);
          }
        );
      }
    });
    console.log("hello world yo");
  };

  return (
    <div className="flex flex-col-reverse">
      Hello amigo I will analyze your website
      <Button
        onClick={() => {
          startAnalysingSitemap();
        }}
      >
        analyze Sitemap
      </Button>
    </div>
  );
};

// Create a root container using createRoot and render the component
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Popup />);
