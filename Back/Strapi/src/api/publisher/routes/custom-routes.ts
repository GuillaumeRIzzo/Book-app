/**
 * publisher router
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
    path: '/publishers',
    handler: 'publisher.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/publishers/:id',
    handler: 'publisher.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
];

export default {
  routes,
};
