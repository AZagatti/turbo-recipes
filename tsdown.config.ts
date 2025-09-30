import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    server: 'src/main/server.ts',
    worker: 'src/main/worker.ts',
    telemetry: 'src/infra/telemetry/index.ts',
  },
  sourcemap: true,
  clean: true,
  format: 'esm',
  outDir: 'dist',
  banner: {
    js: `import 'reflect-metadata'`,
  },
})
