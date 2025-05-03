/**
 * publisher controller
 */

import { factories } from '@strapi/strapi'
import { encryptData } from '../../../utils/encyrpt';

export default factories.createCoreController('api::publisher.publisher', ({ strapi }) => ({
  async find(ctx) {
    const books = await strapi.entityService.findMany('api::publisher.publisher', ctx.query);

    const encrypted = encryptData(books);
    return encrypted;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const book = await strapi.entityService.findOne('api::publisher.publisher', id, ctx.query);

    const encrypted = encryptData(book);
    return encrypted;
  },
}));