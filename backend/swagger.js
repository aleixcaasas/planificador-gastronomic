const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: 'Menu Vital API',
        description: 'API Rest con Node.js, Express y MongoDB para la aplicación de recetas Menu Vital'
    },
    host: 'localhost:3000'
}

const outputFile = './swagger.json'
const routes = ['./routes/*.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)
