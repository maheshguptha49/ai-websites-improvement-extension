import { Issue } from ".";

export function analyzeStructuredDataBasic(): Issue[] {
  const issues: Issue[] = [];

  // 1. Check for JSON-LD structured data
  const jsonLdTags = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  if (jsonLdTags.length === 0) {
    issues.push({
      issue: "No JSON-LD structured data found on the page.",
      level: 2,
    });
  } else {
    jsonLdTags.forEach((tag) => {
      try {
        JSON.parse(tag.textContent || "");
      } catch (e) {
        issues.push({
          issue: "Invalid JSON-LD data found.",
          level: 3,
        });
      }
    });
  }

  // 2. Check for microdata (using itemscope, itemtype, and itemprop)
  const microdataElements = document.querySelectorAll(
    "[itemscope], [itemtype], [itemprop]"
  );
  if (microdataElements.length === 0) {
    issues.push({
      issue: "No microdata (schema.org) found on the page.",
      level: 2,
    });
  }

  // 3. Suggest relevant schemas if structured data is missing
  if (jsonLdTags.length === 0 && microdataElements.length === 0) {
    issues.push({
      issue:
        "Consider adding structured data such as BreadcrumbList, Article, or other schema.org types.",
      level: 1,
    });
  }

  return issues;
}
