const fs = require('fs');
const { execSync } = require('child_process');

function getHostIp() {
  try {
    // This returns the default gateway, i.e., Docker host's IP from inside container
    const output = execSync("ip route | grep default | awk '{print $3}'").toString().trim();
    return output;
  } catch (err) {
    console.error("Failed to get host IP:", err);
    return 'localhost'; // fallback
  }
}

function updateEnvFile(ip) {
  const envPath = '/app/.env'; // make sure this is mounted from host

  let env = fs.readFileSync(envPath, 'utf-8');
  env = env.replace(/NEXT_PUBLIC_API_BASE_URL=http:\/\/.*?:5000\/api\//, `NEXT_PUBLIC_API_BASE_URL=http://${ip}:5000/api/`);

  fs.writeFileSync(envPath, env);
  console.log(`✅ Updated NEXT_PUBLIC_API_BASE_URL with IP ${ip}`);
}

const ip = getHostIp();
updateEnvFile(ip);
