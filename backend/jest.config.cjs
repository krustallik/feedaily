module.exports = {
    testEnvironment: 'node',
    coverageProvider: 'v8',
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.js',
        '!node_modules/**',
        '!coverage/**',
        '!twilioService.mjs'
    ],
    transform: { '^.+\\.(mjs|cjs|js|jsx|ts|tsx)$': 'babel-jest' },
    coverageReporters: ['text','json-summary','lcov'],
    coverageDirectory: './coverage/be'
}
