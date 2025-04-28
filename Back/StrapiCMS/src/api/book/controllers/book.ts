/**
 * book controller
 */

import { factories } from '@strapi/strapi';
import { encryptData } from '../../../utils/encyrpt';

export default factories.createCoreController('api::book.book', ({ strapi }) => ({
  async find(ctx) {
    const books = await strapi.entityService.findMany('api::book.book', ctx.query);

    const encrypted = encryptData(books);
    return encrypted;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const book = await strapi.entityService.findOne('api::book.book', id, ctx.query);

    const encrypted = encryptData(book);
    return encrypted;
  },
}));
