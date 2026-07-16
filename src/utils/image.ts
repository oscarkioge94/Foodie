/**
 * Safely resolves image paths to absolute GitHub raw URLs from the source repository.
 * This guarantees that even if the user's cloned repository on Vercel is missing
 * the large assets, they will load flawlessly in production.
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  // If it's already an absolute URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Strip leading slash
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  // If the path is for local images, resolve to the original GitHub raw CDN
  if (cleanPath.startsWith("images/")) {
    const filename = cleanPath.slice(7); // Remove "images/" prefix

    let resolvedFilename = filename;

    // Gracefully handle custom generated banners that don't exist in the original repo
    if (filename.startsWith("becca_foodies_hero_banner")) {
      resolvedFilename = "about_food.png"; // Beautiful high-quality food blog hero banner
    } else if (filename.startsWith("becca_foodies_botanical_greens")) {
      resolvedFilename = "health.png";
    } else if (filename.startsWith("becca_foodies_coastal_harvest")) {
      resolvedFilename = "kenyan cuisine.jpeg";
    } else if (filename.startsWith("becca_foodies_earth_grain")) {
      resolvedFilename = "beef stew.jpeg";
    }

    // URL encode the filename to handle spaces, commas, etc.
    return `https://raw.githubusercontent.com/Rebby98/Food-Blog/main/static/images/${encodeURIComponent(resolvedFilename)}`;
  }

  return imagePath;
}
