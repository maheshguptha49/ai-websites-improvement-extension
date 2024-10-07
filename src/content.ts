import { Issue, analyzeSitemap } from "./seoAnalysis";
import { checkTitleTags } from "./seoAnalysis/titleCheck";
import { IssueType, WorkerEvents } from "./types";
console.log("content.js file running ");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === WorkerEvents.START_SEO_ANALYSIS) {
    console.log("request came to content.js");
    const issues: Record<
      IssueType.SITEMAP_ISSUES | IssueType.TITLE_ISSUES,
      Issue[]
    > = {
      [IssueType.SITEMAP_ISSUES]: [],
      [IssueType.TITLE_ISSUES]: [],
    };
    analyzeSitemap().then((result) =>
      result ? (issues.SITEMAP_ISSSUES = result.issues) : null
    );
    issues.TITLE_ISSUES = checkTitleTags();
    console.log("Issues: in content.js", issues);
    sendResponse({ issues });
    // Return true to indicate that the response is sent asynchronously
    return true;
  }
});
