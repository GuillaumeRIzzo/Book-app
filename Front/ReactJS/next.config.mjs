/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Désactivé car Babel est actif
  compiler: {
    styledComponents: true,
  },
  experimental: {
    turbo: {
      rules: {}, // <- vide mais valide
    },
  },
  images: {
    domains: [
      'www.babelio.com', 
      'images-na.ssl-images-amazon.com',
      'm.media-amazon.com',
      'upload.wikimedia.org',
      'images.epagine.fr'], // ✅ Ici tu ajoutes tous les domaines autorisés
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        v8: false,
        perf_hooks: false,
      };
    }
    config.infrastructureLogging = { level: 'warn' };
    return config;
  },
  async rewrites() {
    return [
      { source: '/signin', destination: '/auth/signin' },
      { source: '/login', destination: '/auth/login' },
      { source: '/authors', destination: '/author/authors' },
      { source: '/publishers', destination: '/publisher/publishers' },
      { source: '/categories', destination: '/category/categories' },
      { source: '/category/add', destination: '/category/add' },
      { source: '/category/:id', destination: '/category/:id' },
      { source: '/category/:id/edit', destination: '/category/:id/edit' },
      { source: '/users', destination: '/user/users' },
    ];
  },
};

export default nextConfig;
