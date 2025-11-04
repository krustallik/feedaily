import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.js'],
        coverage: {
            provider: 'v8',
            all: true,
            include: ['**/*.jsx'],
            exclude: ['**/node_modules/**','**/dist/**','index.css'],
            reporter: ['text','json-summary','lcov'],
            reportsDirectory: './coverage/fe'
        }
    }
})
