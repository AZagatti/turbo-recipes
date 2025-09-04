import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main/server.ts', 'src/main/worker.ts'],
  sourcemap: true,
  clean: true,
  format: 'esm',
  outDir: 'dist',
  banner: {
    js: `import 'reflect-metadata'`,
  },
})
