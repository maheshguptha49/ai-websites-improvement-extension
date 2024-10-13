// Interface for issues
export interface Issue {
  issue: string;
  level: 1 | 2 | 3 | 4;
}

// Helper function to load the image asynchronously
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
  });
}

// Function to analyze OG tags
export const analyzeOGTags = async (): Promise<Issue[]> => {
  const issues: Issue[] = [];

  // List of essential OG tags to check
  const requiredOgTags = ["og:title", "og:description", "og:image", "og:url"];

  requiredOgTags.forEach((tag) => {
    const metaTag = document.querySelector(`meta[property="${tag}"]`);

    if (!metaTag || !metaTag.getAttribute("content")) {
      issues.push({
        issue: `Missing Open Graph tag: ${tag}`,
        level: 2,
      });
    }
  });

  // If og:image exists, verify its accessibility and size
  const ogImageTag = document.querySelector('meta[property="og:image"]');

  if (ogImageTag) {
    const ogImageUrl = ogImageTag.getAttribute("content");

    if (ogImageUrl) {
      try {
        const image = await loadImage(ogImageUrl);
        // Validate if the image size is within the recommended range (10KB - 200KB)
        const imgSizeKB = (image.width * image.height * 4) / 1024; // Estimate size based on dimensions

        if (imgSizeKB < 10 || imgSizeKB > 200) {
          issues.push({
            issue: `Open Graph image size is not optimal (should be between 10KB and 200KB): ${ogImageUrl}`,
            level: 2,
          });
        }
      } catch (error) {
        issues.push({
          issue: `OG Image URL is not accessible: ${ogImageUrl}`,
          level: 3,
        });
      }
    }
  } else {
    issues.push({
      issue: "Missing OG image tag or empty content",
      level: 2,
    });
  }

  return issues;
};
