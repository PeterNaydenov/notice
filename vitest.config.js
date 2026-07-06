import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['node_modules', 'test', 'coverage'],
      reporter: ['lcov', 'text-summary'],
    },
  },
})