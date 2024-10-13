import { Issue } from ".";

export function analyzeCanonicalTags(): Issue[] {
  const issues: Issue[] = [];

  // Get the canonical link tag from the document
  const canonicalTag = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement;
  const pageURL = window.location.href;

  if (!canonicalTag) {
    // If no canonical tag is found, add a warning
    issues.push({
      issue: "No canonical tag found on the page",
      level: 2,
    });
  } else {
    const canonicalURL = canonicalTag.href;

    // Ensure the canonical URL is a valid URL
    try {
      const parsedCanonicalURL = new URL(canonicalURL);

      // Check if the canonical URL matches the current page URL (self-referencing)
      if (parsedCanonicalURL.href !== pageURL) {
        issues.push({
          issue: `Canonical tag does not match the current page URL. Found: ${canonicalURL}`,
          level: 2,
        });
      }
    } catch (error) {
      issues.push({
        issue: `Invalid canonical URL: ${canonicalURL}`,
        level: 3,
      });
    }
  }

  return issues;
}
