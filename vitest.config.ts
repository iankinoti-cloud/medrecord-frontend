import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      all: true,
      exclude: ['node_modules/', 'dist/', 'src/main.jsx'],
      statements: 90,
      branches: 85,
      functions: 85,
      lines: 90,
    },
  },
})
