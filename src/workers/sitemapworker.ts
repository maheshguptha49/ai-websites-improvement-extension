import { BackgroundResponse, Issue } from "../seoAnalysis";

// src/background.ts

// Function to handle sitemap fetching and analysis
export async function handleSitemapFetch(): Promise<BackgroundResponse> {
  const tabs = await getActiveTab();
  const baseURL = new URL(tabs[0].url ? tabs[0].url : "").origin;
  const sitemapURL = `${baseURL}/sitemap.xml`;

  try {
    const response = await fetch(sitemapURL);
    if (!response.ok) throw new Error("Sitemap not found!");

    const sitemapText = await response.text();

    // Extract URLs manually using a regular expression
    const urls: string[] = [];
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = urlRegex.exec(sitemapText)) !== null) {
      urls.push(match[1]); // Extract the URL from the match
    }

    // Analyze URLs and return the result
    return analyzeSitemap(urls);
  } catch (error: any) {
    throw new Error(`Failed to fetch or analyze the sitemap: ${error.message}`);
  }
}

// Helper function to get the active tab
function getActiveTab(): Promise<chrome.tabs.Tab[]> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(tabs);
    });
  });
}

// Basic sitemap analysis function
function analyzeSitemap(urls: string[]): BackgroundResponse {
  const issues: Issue[] = [];

  urls.forEach((url) => {
    if (url.length > 115)
      issues.push({ issue: `URL too long: ${url}`, level: 1 });
    if (url.includes("//") && !url.includes("://"))
      issues.push({ issue: `Double slash in URL: ${url}`, level: 1 });
    const specialChars = /[^\w\-_.~:\/?&=+]/g;

    if (specialChars.test(url))
      issues.push({ issue: `Special characters in URL: ${url}`, level: 1 });
  });

  return { urlCount: urls.length, issues };
}
