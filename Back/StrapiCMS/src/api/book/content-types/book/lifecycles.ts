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

  if ((!data.bookImage || (Array.isArray(data.bookImage) && data.bookImage.length === 0)) && (!data.bookImageLink || data.bookImageLink.trim() === '')) {
    throw new Error('At least one of bookImage (file) or bookImageLink (external URL) must be provided.');
  }

  if (!data.bookImage && data.bookImageLink) {
    const isValidUrl = await validateImageUrl(data.bookImageLink);

    if (!isValidUrl) {
      throw new Error('The provided bookImageLink is invalid or not reachable.');
    }

    const uploadedFile = await downloadAndUploadImage(data.bookImageLink);

    if (uploadedFile) {
      data.bookImage = uploadedFile.id;
    } else {
      throw new Error('Failed to download and attach the bookImage from the provided URL.');
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
