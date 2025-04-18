const fs = require("fs");
const path = require("path");

// Paths
const rootEnvPath = path.resolve(__dirname, ".env");
const reactEnvPath = path.resolve(__dirname, "FrontReactJs/.env");

// Read root .env
const envFile = fs.readFileSync(rootEnvPath, "utf-8");

// Filter only REACT_APP_ variables
const reactEnv = envFile
  .split("\n")
  .filter(line => line.startsWith("NEXT_PUBLIC_"))
  .join("\n");

// Write to React's .env
fs.writeFileSync(reactEnvPath, reactEnv, { encoding: "utf-8" });

console.log(`Synced ${reactEnv.split('\n').length} variables to FrontReactJs/.env`);
