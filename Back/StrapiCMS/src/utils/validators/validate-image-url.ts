export const validateImageUrl = (url: unknown): boolean => {
  if (typeof url !== 'string') {
    return false; // URL must be a string
  }

  // Allow empty string = optional image
  if (url.trim() === '') {
    return true;
  }

  // Check if it's a valid HTTP/HTTPS URL and ends with an image extension
  const pattern = /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i;
  return pattern.test(url);
};
