// src/extensions/users-permissions/strapi-server.ts

import userController from './controllers/user';

export default (plugin) => {
  plugin.controllers.user = userController;
  return plugin;
};