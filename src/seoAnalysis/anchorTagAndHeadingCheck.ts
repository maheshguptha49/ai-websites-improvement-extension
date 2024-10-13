// Interface for issues
export interface Issue {
  issue: string;
  level: 1 | 2 | 3 | 4;
}

export const checkHeadingAndAnchorText = async (): Promise<Issue[]> => {
  const issues: Issue[] = [];

  // Validate the presence and correct usage of heading tags (e.g., <h1>, <h2>)
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let h1Count = 0;
  let h1Text = "h1Text";
  headings.forEach((heading) => {
    if (heading.tagName === "H1") {
      h1Count++;
      h1Text = heading.textContent?.trim() || "";
    }

    // Check if the heading is empty
    if (!heading.textContent || heading.textContent.trim().length === 0) {
      issues.push({
        issue: `Empty heading tag (${heading.tagName}) detected`,
        level: 2,
      });
    }
    // Validate the presence of the <title> tag
    const titleElement = document.querySelector("title");
    const pageTitle = titleElement?.textContent?.trim() || "";
    // Check if the page title is the same as the <h1> text
    if (
      pageTitle &&
      h1Text &&
      pageTitle.toLowerCase() === h1Text.toLowerCase()
    ) {
      issues.push({
        issue:
          "The page title should not be identical to the <h1> tag. The title should be a concise summary, while the <h1> should provide more detail.",
        level: 2,
      });
    }
  });

  // Ensure there's only one <h1> tag
  if (h1Count > 1) {
    issues.push({
      issue: `Multiple <h1> tags found (${h1Count}). Only one <h1> tag should be used per page.`,
      level: 2,
    });
  } else if (h1Count === 0) {
    issues.push({
      issue: "No <h1> tag found on the page.",
      level: 2,
    });
  }

  // Check internal links for no broken links and descriptive anchor text
  const links: Element[] = [];
  document
    .querySelectorAll("a[href^='/'], a[href^='" + window.location.origin + "']")
    .forEach((item) => {
      links.push(item);
    });
  await checkInternalLinks(links, issues);
  return issues;
};
// Function to check internal links for broken links, descriptive anchor text, and URL issues
async function checkInternalLinks(
  links: Element[],
  issues: Issue[]
): Promise<void> {
  const linkPromises = links.map(async (link) => {
    const href = link.getAttribute("href") || "";
    const anchorText = link.textContent?.trim();

    // Check if the anchor text is descriptive
    if (!anchorText) {
      issues.push({
        issue: `Internal link without descriptive text: ${href}`,
        level: 2,
      });
    }
    if (href !== href.toLowerCase()) {
      issues.push({
        issue: `URL should be in lowercase to avoid duplicate content issues: ${href}`,
        level: 2,
      });
    }
    // URL optimization checks
    if (href) {
      // Check for URL issues using the helper function
      checkUrlOptimization(href, issues);

      // Fetch the link to check if it's broken
      try {
        const response = await fetch(href, { method: "HEAD" });
        if (!response.ok) {
          issues.push({
            issue: `Broken internal link detected: ${href}`,
            level: 3,
          });
        }
      } catch (error) {
        issues.push({
          issue: `Failed to check internal link: ${href}`,
          level: 3,
        });
      }
    }
  });

  // Wait for all fetch requests to complete
  await Promise.all(linkPromises);
}

// Helper function to check URL optimization issues
function checkUrlOptimization(href: string, issues: Issue[]): void {
  // Check if the URL length is too long
  if (href.length > 115) {
    issues.push({
      issue: `URL is too long (over 115 characters): ${href}`,
      level: 2,
    });
  }

  // Check for the presence of special characters (excluding valid URL characters)
  const specialChars = /[^\w\-_.~:\/?&=+]/g;
  if (specialChars.test(href)) {
    issues.push({
      issue: `URL contains special characters: ${href}`,
      level: 2,
    });
  }

  // Check for double slashes in the URL (excluding protocol "://")
  if (
    href.includes("//") &&
    !href.startsWith("http://") &&
    !href.startsWith("https://")
  ) {
    issues.push({
      issue: `URL contains double slashes: ${href}`,
      level: 2,
    });
  }

  // Check if hyphens are used as delimiters for multi-word segments
  const urlSegments = href.split("/");
  urlSegments.forEach((segment) => {
    if (isMultiWord(segment) && !segment.includes("-")) {
      issues.push({
        issue: `URL segment should use hyphens for better readability: ${segment} in ${href}`,
        level: 1,
      });
    }

    // Check for underscores
    if (segment.includes("_")) {
      issues.push({
        issue: `URL segment contains underscores and should use hyphens: ${segment} in ${href}`,
        level: 1,
      });
    }
  });
}

// Helper function to determine if a segment likely contains multiple words
function isMultiWord(segment: string): boolean {
  // Check if the segment is camelCase or has multiple words concatenated
  return (
    /(?<=[a-z])(?=[A-Z])/.test(segment) || /[A-Za-z]+\d+[A-Za-z]+/.test(segment)
  );
}
