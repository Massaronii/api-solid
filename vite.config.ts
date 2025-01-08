import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'prisma',
    environmentOptions: {
      adapter: 'postgresql',
      envFile: '.env.example',
      prismaEnvVarName: 'DATABASE_URL', // Optional
      transformMode: 'ssr', // Optional
    },
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],

    dir: 'src', // Essa linha
  },
})
