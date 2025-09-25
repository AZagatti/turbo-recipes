import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const isUnitTestRun = process.env.TEST_ENV === 'unit'
const isIntegrationTestRun = process.env.TEST_ENV === 'integration'
const isE2ETestRun = process.env.TEST_ENV === 'e2e'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: [
      ...(isUnitTestRun ? ['src/**/*.spec.ts'] : []),
      ...(isIntegrationTestRun ? ['src/**/*.integration.test.ts'] : []),
      ...(isE2ETestRun ? ['src/**/*.e2e.test.ts'] : []),
      ...(!isUnitTestRun && !isIntegrationTestRun && !isE2ETestRun
        ? ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
        : []),
    ],
    setupFiles: ['./vitest.setup.ts'],
    globalSetup: !isUnitTestRun ? './vitest.global-setup.ts' : undefined,
    fileParallelism: !isUnitTestRun ? false : true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'json'],
      reportOnFailure: true,
      include: ['src/core/use-cases/**'],
      exclude: [
        'src/core/use-cases/**/_test/**',
        'src/core/use-cases/**/*.test.*',
        'src/core/use-cases/usecase.ts',
      ],
    },
  },
})
