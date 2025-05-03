// src/extensions/users-permissions/routes/user.ts

export default [
  {
    method: 'GET',
    path: '/users',
    handler: 'user.find',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/users/count',
    handler: 'user.count',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/users/me',
    handler: 'user.me',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/users/:id',
    handler: 'user.findOne',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'POST',
    path: '/users',
    handler: 'user.create',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'PUT',
    path: '/users/:id',
    handler: 'user.update',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'DELETE',
    path: '/users/:id',
    handler: 'user.destroy',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];
