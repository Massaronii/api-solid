import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'prisma',
    environmentOptions: {
      adapter: 'postgres',
      envFile: '.env.example',
      prismaEnvVarName: 'DATABASE_URL',
      transformMode: 'ssr',
    },
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],

    dir: 'src', // Essa linha
  },
})
