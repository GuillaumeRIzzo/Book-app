import path from 'path';
import * as dotenv from 'dotenv';

// Explicitly load the project root .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env.local') }); // try local override first
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });       // fallback to root


export default ({ env }) => {
  const client = env('STRAPI_DATABASE_CLIENT'); // no fallback

  const connections = {
    postgres: {
      connection: {
        host: env('STRAPI_DATABASE_HOST', 'strapi-db'),
        port: env.int('STRAPI_DATABASE_PORT', 5432),
        database: env('STRAPI_DATABASE_NAME', 'strapi'),
        user: env('STRAPI_DATABASE_USERNAME', 'strapi'),
        password: env('STRAPI_DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('STRAPI_DATABASE_SSL', false),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
