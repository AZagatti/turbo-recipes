import { execa } from 'execa'
import { config } from 'dotenv'

config({ path: '.env.test' })

export async function setup() {
  console.log('🆙 Setting up the test database...')

  await execa('docker', [
    'compose',
    '-f',
    'docker-compose.test.yml',
    'up',
    '--wait',
  ])

  await execa('pnpm', ['drizzle-kit', 'migrate'])

  console.log('🚀 Test database is ready.')

  return async () => {
    console.log('👇 Tearing down the test database...')
    await execa('docker', ['compose', '-f', 'docker-compose.test.yml', 'down'])
  }
}
