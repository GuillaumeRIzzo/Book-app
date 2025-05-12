const fs = require('fs');
const { execSync } = require('child_process');

function getHostIp() {
  try {
    const output = execSync("ip route | grep default | awk '{print $3}'").toString().trim();
    return output;
  } catch (err) {
    console.error("Failed to get host IP:", err);
    return 'localhost';
  }
}

function updateEnvFile(ip) {
  const envPath = '/app/.env'; // Path inside the container

  let env = fs.readFileSync(envPath, 'utf-8');

  // Update NEXT_PUBLIC_API_BASE_URL (for your .NET API)
  env = env.replace(
    /NEXT_PUBLIC_API_BASE_URL=http:\/\/.*?:5000\/api\//,
    `NEXT_PUBLIC_API_BASE_URL=http://${ip}:5000/api/`
  );

  // Update NEXT_PUBLIC_STRAPI_API_URL (for Strapi API)
  if (env.match(/NEXT_PUBLIC_STRAPI_API_URL=/)) {
    env = env.replace(
      /NEXT_PUBLIC_STRAPI_API_URL=http:\/\/.*?:1337\/api\//,
      `NEXT_PUBLIC_STRAPI_API_URL=http://${ip}:1337/api/`
    );
  } else {
    env += `\nNEXT_PUBLIC_STRAPI_API_URL=http://${ip}:1337/api/`;
  }

  // Prepare Mongo for later
  // if (!env.includes('NEXT_PUBLIC_MONGO_API_URL=')) {
  //   env += `\nNEXT_PUBLIC_MONGO_API_URL=http://${ip}:3001/api/`; // Adjust port later
  // }

  fs.writeFileSync(envPath, env);
  console.log(`✅ Updated .env:
- NEXT_PUBLIC_API_BASE_URL=http://${ip}:5000/api/
- NEXT_PUBLIC_STRAPI_API_URL=http://${ip}:1337/api/
- NEXT_PUBLIC_MONGO_API_URL=http://${ip}:3001/api/`);
}

const ip = getHostIp();
updateEnvFile(ip);
