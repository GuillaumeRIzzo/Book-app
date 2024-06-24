import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/signin',
        destination: '/auth/signin',
      },
      {
        source: '/login',
        destination: '/auth/login',
      },
      {
        source: '/authors',
        destination: '/author/authors',
      },
      {
        source: '/publishers',
        destination: '/publisher/publishers',
      },
      {
        source: '/bookcategories',
        destination: '/book-category/bookcategories',
      },
      {
        source: '/users',
        destination: '/user/users',
      }
    ];
  },

};

export default withPlugins([[withTM]], nextConfig);
