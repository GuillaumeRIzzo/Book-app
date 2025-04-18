import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'

const env = dotenv.config({ path: path.resolve('.env') }).parsed

if (!env) {
  console.error('❌ .env file not found or empty')
  process.exit(1)
}

// Only expose variables that start with ANGULAR_
const angularEnv = Object.entries(env).filter(([key]) => key.startsWith('ANGULAR_'))

const content = `
export const environment = {
  production: false,
  ${angularEnv
    .map(([key, value]) => `${key.replace('ANGULAR_', '')}: "${value}"`)
    .join(',\n  ')}
}
`

fs.writeFileSync('Front/src/environments/environment.ts', content)
console.log('✅ Angular environment file generated.')
