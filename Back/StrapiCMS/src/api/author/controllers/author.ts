/**
 * author controller
 */

import { factories } from '@strapi/strapi'
import { encryptData } from '../../../utils/encyrpt';

const contentTypeUID = 'api::author.author' as any;

export default factories.createCoreController(contentTypeUID, ({ strapi }) => ({
  async find(ctx) {
    const authors = await strapi.entityService.findMany(contentTypeUID, ctx.query);
    return encryptData(authors);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const author = await strapi.entityService.findOne(contentTypeUID, id, ctx.query);
    return encryptData(author);
  },
}));
