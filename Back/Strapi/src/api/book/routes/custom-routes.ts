/**
 * book router
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
    path: '/books',
    handler: 'book.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/books/:id',
    handler: 'book.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
];

export default {
  routes,
};
