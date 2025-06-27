const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();

const env = result.parsed;

const envJsContent = `window.__env = ${JSON.stringify(env, null, 2)};`;

fs.writeFileSync('./Front/assets/env.js', envJsContent);
console.log('✅ env.js generated');
