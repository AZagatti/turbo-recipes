import { execSync } from 'node:child_process'
import 'dotenv/config'

export async function setup() {
  console.log('Setting up the test database...')

  execSync('docker compose -f docker-compose.test.yml up -d')

  execSync('pnpm drizzle-kit migrate')

  console.log('Test database is ready.')

  return async () => {
    console.log('Tearing down the test database...')
    execSync('docker compose -f docker-compose.test.yml down')
  }
}
