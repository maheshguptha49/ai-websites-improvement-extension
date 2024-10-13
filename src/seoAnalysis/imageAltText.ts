import { Issue } from "../seoAnalysis";

export interface ImageSEOAnalysisResult {
  imageCount: number;
  issues: Issue[];
}

export function analyzeImages(): Issue[] {
  const issues: Issue[] = [];
  const images = document.querySelectorAll("img");
  let imageCount = 0;

  images.forEach((img) => {
    imageCount++;

    const altText = img.getAttribute("alt");
    const imgSrc = img.getAttribute("src");

    // Check if alt text is present
    if (!altText) {
      issues.push({
        issue: `Image missing alt text. Source: ${imgSrc}`,
        level: 1,
      });
    } else {
      // Validate alt text length
      const altTextLength = altText.length;
      if (altTextLength < 10 || altTextLength > 125) {
        issues.push({
          issue: `Alt text should be between 10 and 125 characters: "${altText}"`,
          level: 2,
        });
      }
    }

    // Validate image size
    if (imgSrc) {
      const image = new Image();
      image.src = imgSrc;

      // Use a Promise to get the image size
      image.onload = () => {
        const imgSizeKB = image.src.length / 1024; // Simplified size estimation

        if (imgSizeKB < 10 || imgSizeKB > 200) {
          issues.push({
            issue: `Image size is not optimal (should be between 10KB and 200KB): ${imgSrc}`,
            level: 2,
          });
        }

        // Suggest compression if images are too large
        if (imgSizeKB > 200) {
          issues.push({
            issue: `Image is too large; consider compressing: ${imgSrc}`,
            level: 3,
          });
        }
      };
    }
  });

  return issues;
}
