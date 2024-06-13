import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
};

export default withPlugins([
  [withTM],
], nextConfig);