const Router = require('express')
const { emailRegister, logIn } = require('../controllers/auth.controller.js')

const authRouter = Router()

authRouter.post('/email-register', emailRegister)
authRouter.post('/login', logIn)

module.exports = { authRouter }
