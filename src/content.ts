import { Issue, analyzeSitemap } from "./seoAnalysis";
import { checkHeadingAndAnchorText } from "./seoAnalysis/anchorTagAndHeadingCheck";
import { analyzeCanonicalTags } from "./seoAnalysis/canonicalTagAnalysis";
import { analyzeImages } from "./seoAnalysis/imageAltText";
import { analyzeMetaTags } from "./seoAnalysis/metaTag";
import { analyzeOGTags } from "./seoAnalysis/ogTag";
import { analyzeStructuredDataBasic } from "./seoAnalysis/structuredDataanalysis";
import { checkTitleTags } from "./seoAnalysis/titleCheck";
import { IssueType, WorkerEvents } from "./types";
console.log("content.js file running ");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === WorkerEvents.START_SEO_ANALYSIS) {
    console.log("request came to content.js");

    collectIssues(sendResponse);
    // Return true to indicate that the response is sent asynchronously
    return true;
  }
});

const collectIssues = async (sendResponse: (response?: any) => void) => {
  console.log("in collectIssues");
  const issues: Record<IssueType, Issue[]> = {
    [IssueType.SITEMAP]: [],
    [IssueType.TITLE]: checkTitleTags(),
    [IssueType.CANONICAL]: analyzeCanonicalTags(),
    [IssueType.META_TAG]: analyzeMetaTags(),
    [IssueType.STRUCTURED_DATA]: analyzeStructuredDataBasic(),
    [IssueType.IMAGE_ALT_TEXT]: analyzeImages(),
    [IssueType.H1_AND_ANCHOR_TEXT]: await checkHeadingAndAnchorText(),
    [IssueType.OG_IMAGE]: await analyzeOGTags(),
  };
  console.log(issues, "issues in content.ts");
  const res = await analyzeSitemap();
  issues.SITEMAP = res?.issues || [];

  sendResponse(issues);
};
