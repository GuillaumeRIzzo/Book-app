/**
 * book-category router
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
    path: '/bookcategory',
    handler: 'book-category.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/bookcategory/:id',
    handler: 'book-category.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
];

export default {
  routes,
};

