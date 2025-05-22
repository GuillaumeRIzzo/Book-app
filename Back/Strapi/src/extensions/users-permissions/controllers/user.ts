// src/extensions/users-permissions/controllers/user.ts

import { factories } from '@strapi/strapi';
import { encryptData } from '../../../utils/encyrpt';

// Create a custom controller
export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  // Custom find method
  async find(ctx) {
    console.log('Custom find method triggered!');
    
    // Use fetchAll or fetch to retrieve users
    const users = await strapi.db.query('plugin::users-permissions.user').findMany({
      where: { ...ctx.query },
    });  // or userService.fetch(ctx.query);

    return encryptData(users);
  },

  // Default count method
  async count(ctx) {
    const count = await strapi.db.query('plugin::users-permissions.user').count({
      where: { ...ctx.query },
    });
    return count;
  },

  // Default me method for authenticated user's info
  async me(ctx) {
    const user = ctx.state.user; // `ctx.state.user` holds the authenticated user
    if (!user) {
      return ctx.badRequest('User not authenticated');
    }
    return user;
  },

  // Default delete method for deleting a user by ID
  async destroy(ctx) {
    const { id } = ctx.params; // Get the user ID from the URL params
    try {
      const user = await strapi.plugin('users-permissions').service('user').delete({ id });

      if (!user) {
        return ctx.notFound('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      strapi.log.error(error);
      ctx.throw(500, 'Internal Server Error');
    }
  },

  // Default update method for updating user data
  async update(ctx) {
    const { id } = ctx.params; // Get the user ID from the URL params
    const { data } = ctx.request.body; // Get the new data from the request body

    try {
      const user = await strapi.plugin('users-permissions').service('user').update({ id }, { data });

      if (!user) {
        return ctx.notFound('User not found');
      }

      return { message: 'User updated successfully', user };
    } catch (error) {
      strapi.log.error(error);
      ctx.throw(500, 'Internal Server Error');
    }
  },

  // Custom findOne method
  async findOne(ctx) {
    const { id } = ctx.params;

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id },
      populate: ['role'], // customize relations as needed
    });

    if (!user) {
      return ctx.notFound('User not found');
    }

    // Optional: custom transformation
    return encryptData(user);
  },

  // Default create method
  async create(ctx) {
    try {
      const result = await strapi.plugin('users-permissions').service('user').create(ctx);
      return result;
    } catch (error) {
      strapi.log.error(error);
      ctx.throw(500, 'Internal Server Error');
    }
  },
}));
