/**
 * author router
 */

type Route = {
  method: string;
  path: string;
  handler: string;
  config: {
    policies: any[];
    auth: boolean;
  };
};

const routes: Route[] = [
  {
    method: 'GET',
    path: '/authors',
    handler: 'author.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/authors/:id',
    handler: 'author.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
];

export default {
  routes,
};
