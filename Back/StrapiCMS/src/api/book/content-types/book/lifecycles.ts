import axios from 'axios';
import { validateImageUrl } from '../../../../utils/validators/validate-image-url';

export default {
  async beforeCreate(event: any) {
    await ensureImageOrUrl(event);
  },

  async beforeUpdate(event: any) {
    await ensureImageOrUrl(event);
  },
};

async function ensureImageOrUrl(event: any) {
  const { data } = event.params;

  const noImageProvided =
    (!data.bookImage || (Array.isArray(data.bookImage) && data.bookImage.length === 0)) &&
    (!data.bookImageLink || data.bookImageLink.trim() === '');

  if (noImageProvided) {
    throw new Error('At least one of bookImage (file) or bookImageLink (external URL) must be provided.');
  }

  // If bookImage is missing, and bookImageLink is provided
  if ((!data.bookImage || data.bookImage.length === 0) && data.bookImageLink) {
    const isValidUrl = await validateImageUrl(data.bookImageLink);

    if (!isValidUrl) {
      console.warn('⚠️ bookImageLink is invalid or not reachable:', data.bookImageLink);
      // Allow creation without throwing
      return;
    }

    try {
      const uploadedFile = await downloadAndUploadImage(data.bookImageLink);
      if (uploadedFile) {
        data.bookImage = uploadedFile.id;
      } else {
        console.warn('⚠️ Could not upload image, keeping bookImageLink only');
      }
    } catch (error) {
      console.warn('⚠️ Exception during image download/upload:', error);
      // Don’t throw — we keep bookImageLink even if upload fails
    }
  }
}

async function downloadAndUploadImage(url: string) {
  try {
    // Fetch the image
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const buffer = Buffer.from(response.data, 'binary');
    const fileName = url.split('/').pop()?.split('?')[0] ?? 'remote-image.jpg';

    const uploadResult = await strapi.plugins.upload.services.upload.upload({
      data: {}, // Mandatory, can be left empty
      files: {
        path: undefined,
        name: fileName,
        type: response.headers['content-type'] || 'image/jpeg', // default if missing
        size: buffer.length,
        buffer,
      },
    });

    return uploadResult[0];
  } catch (error) {
    console.error('Failed to download and upload bookImageLink:', error);
    return null;
  }
}
