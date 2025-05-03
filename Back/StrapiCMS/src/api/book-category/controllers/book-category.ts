/**
 * book-category controller
 */

import { factories } from '@strapi/strapi';
import { encryptData } from '../../../utils/encyrpt';

const contentTypeUID = 'api::book-category.book-category' as any;

export default factories.createCoreController(contentTypeUID, ({ strapi }) => ({
  async find(ctx) {
    const categories = await strapi.entityService.findMany(contentTypeUID, {
      ...ctx.query,
    });

    const shapedCategories = categories.map((cat: any) => ({
      bookCategoId: cat.id,
      bookCategoName: cat.bookCategoName,
      bookCategoDescription: cat.bookCategoDescription,
    }));

    const encrypted = encryptData(shapedCategories);
    return encrypted;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const cat = await strapi.entityService.findOne(contentTypeUID, id, {
      ...ctx.query,
    });

    const shaped = {
      bookCategoId: cat.id,
      bookCategoName: cat.bookCategoName,
      bookCategoDescription: cat.bookCategoDescription,
    };

    const encrypted = encryptData(shaped);
    return encrypted;
  },
}));
