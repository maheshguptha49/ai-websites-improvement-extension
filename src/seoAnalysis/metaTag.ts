export interface Issue {
  issue: string;
  level: 1 | 2 | 3 | 4;
}

// Function to analyze meta tags on a single page
export function analyzeMetaTags(): Issue[] {
  const issues: Issue[] = [];

  // Analyze the meta description tag
  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    const descriptionContent =
      descriptionTag.getAttribute("content")?.trim() || "";
    if (descriptionContent.length === 0) {
      issues.push({
        issue: "Meta description is empty.",
        level: 2, // Moderate issue for SEO
      });
    } else if (
      descriptionContent.length < 150 ||
      descriptionContent.length > 160
    ) {
      issues.push({
        issue: `Meta description should be between 150 and 160 characters. Current length: ${descriptionContent.length}`,
        level: 1, // Lower-priority issue for SEO
      });
    }
  } else {
    issues.push({
      issue: "Meta description tag is missing.",
      level: 3, // High-priority issue for SEO
    });
  }

  // Analyze the meta keywords tag
  const keywordsTag = document.querySelector('meta[name="keywords"]');
  if (keywordsTag) {
    const keywordsContent = keywordsTag.getAttribute("content")?.trim() || "";
    if (keywordsContent.length === 0) {
      issues.push({
        issue: "Meta keywords tag is empty.",
        level: 1, // Lower-priority issue (less critical for modern SEO)
      });
    }
  }

  return issues;
}
