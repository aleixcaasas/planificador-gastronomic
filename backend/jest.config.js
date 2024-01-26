module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'controllers/ingredient.controller.js',
        'controllers/planning.controller.js',
        'controllers/recipe.controller.js'
    ]
}
