require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { userRouter } = require('./routes/user.routes.js')
const { authRouter } = require('./routes/auth.routes.js')
const { recipeRouter } = require('./routes/recipe.routes.js')
const { planningRouter } = require('./routes/planning.routes.js')
const { ingredientRouter } = require('./routes/ingredient.routes.js')

const jwt = require('jsonwebtoken')
const { getUser } = require('./utils/queries.js')

const PORT = process.env.PORT || 3000

const app = express()

// MIDDLEWARE: JWT token verification
const verifyToken = async (req, res, next) => {
    const token = req.headers.cookie.split('token=')[1]

    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { ...(await getUser(decoded.user_id)), user_id: decoded.user_id }
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no encontrado' })
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ error: 'No autorizado' })
    }
}

// Middlewares
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors({ origin: ['http://localhost:5173', 'http://menuvital.es'], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger docs
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// ALL THE ROUTERS OF THE APP WILL BE HERE
app.use('/api', authRouter)
app.use('/api', verifyToken, recipeRouter)
app.use('/api', verifyToken, planningRouter)
app.use('/api', verifyToken, ingredientRouter)
app.use('/api', verifyToken, userRouter)

// STARTING THE SERVER
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})
