import { IImprovementsJson, WorkerEvents } from "../types";

export interface Issue {
  issue: string;
  level: 1 | 2 | 3 | 4;
}
const improvements: IImprovementsJson = {
  issues: [],
};
export interface BackgroundResponse {
  urlCount: number;
  issues: Issue[];
}

export async function analyzeSitemap(): Promise<BackgroundResponse | null> {
  try {
    // Send a message to background.ts to fetch and analyze the sitemap
    const response = await sendMessageToBackground({
      action: WorkerEvents.FETCH_SITEMAP,
    });
    console.log("Sitemap Analysis Result: ", response);
    return response;
  } catch (error) {
    console.error("Error in analyzing sitemap:", error);
    return null;
  }
}

// Function to send a message and return a promise that resolves when the response is received
function sendMessageToBackground(message: object): Promise<BackgroundResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(response);
    });
  });
}
