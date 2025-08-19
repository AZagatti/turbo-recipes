import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const isUnitTestRun = process.env.TEST_ENV === 'unit'
const isIntegrationTestRun = process.env.TEST_ENV === 'integration'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: [
      ...(isIntegrationTestRun ? ['src/**/*.integration.test.ts'] : []),
      ...(isUnitTestRun ? ['src/**/*.spec.ts'] : []),
      ...(!isUnitTestRun && !isIntegrationTestRun
        ? ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
        : []),
    ],
    setupFiles: ['./vitest.setup.ts'],
    globalSetup: !isUnitTestRun ? './vitest.global-setup.ts' : undefined,
    fileParallelism: !isUnitTestRun ? false : true,
  },
})
