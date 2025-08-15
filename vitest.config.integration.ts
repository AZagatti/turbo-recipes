import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    globalSetup: './vitest.global-setup.ts',
  },
})
