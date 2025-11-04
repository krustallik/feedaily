import js from '@eslint/js'
import vitest from 'eslint-plugin-vitest'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    plugins: { vitest },
    languageOptions: { globals: vitest.environments.env.globals },
  },
]
