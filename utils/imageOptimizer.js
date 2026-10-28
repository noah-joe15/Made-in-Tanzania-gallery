// ==========================================
// Image Optimization Utility
// Uses Vercel's built-in image optimization
// ==========================================

/**
 * Optimizes an image URL using Vercel's image optimization service
 * @param {string} imageUrl - The original image URL
 * @param {number} width - Target width in pixels (default: 800)
 * @param {number} quality - Compression quality 1-100 (default: 75)
 * @returns {string} - Optimized image URL
 */
export function optimizeImage(imageUrl, width = 800, quality = 75) {
  // If no URL or it's a YouTube thumbnail, return as-is
  if (!imageUrl || imageUrl.includes('youtube') || imageUrl.includes('ytimg')) {
    return imageUrl;
  }

  // Encode the URL for the Vercel optimization service
  const encodedUrl = encodeURIComponent(imageUrl);
  
  // Return the optimized URL
  return `/_vercel/image?url=${encodedUrl}&w=${width}&q=${quality}`;
}

/**
 * Get different sizes for responsive images
 * @param {string} imageUrl - The original image URL
 * @returns {object} - Object with different size URLs
 */
export function getResponsiveImages(imageUrl) {
  return {
    thumbnail: optimizeImage(imageUrl, 400, 70),  // For gallery grid
    medium: optimizeImage(imageUrl, 800, 75),      // For lightbox
    large: optimizeImage(imageUrl, 1200, 80)       // For full-screen view
  };
}
