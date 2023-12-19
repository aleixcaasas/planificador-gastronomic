require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { authRouter } = require('./routes/auth.routes.js')
const { recipeRouter } = require('./routes/recipe.routes.js')
const { planningRouter } = require('./routes/planning.routes.js')
const { ingredientRouter } = require('./routes/ingredient.routes.js')

const PORT = process.env.PORT || 3000

const app = express()

// Middlewares
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ALL THE ROUTERS OF THE APP WILL BE HERE
app.use('/api', authRouter)
app.use('/api', recipeRouter)
app.use('/api', planningRouter)
app.use('/api', ingredientRouter)

// STARTING THE SERVER
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})
