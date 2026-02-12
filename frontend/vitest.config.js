/**
 * Vitest Configuration
 * 
 * Vitest is a fast test runner built for Vite projects
 * It's Jest-compatible but much faster
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for browser-like environment
    environment: 'jsdom',
    
    // Setup file to run before each test
    setupFiles: ['./src/test/setup.js'],
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration (optional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
      ],
    },
  },
})
