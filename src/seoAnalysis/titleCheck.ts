import { Issue } from ".";

// Function to check title tags
export function checkTitleTags(): Issue[] {
  const issues: Issue[] = [];
  const titleElements = document.getElementsByTagName("title");

  // Check for the number of <title> tags
  if (titleElements.length === 0) {
    issues.push({ issue: "No <title> tag found.", level: 1 });
  } else if (titleElements.length > 1) {
    issues.push({ issue: "Multiple <title> tags found.", level: 1 });
  } else {
    const title = titleElements[0].textContent || "";
    const titleLength = title.length;

    // Check the length of the title
    if (titleLength < 50 || titleLength > 60) {
      issues.push({
        issue: `Title length is ${titleLength} characters. It should be between 50 and 60 characters.`,
        level: 1,
      });
    }
  }

  return issues;
}
