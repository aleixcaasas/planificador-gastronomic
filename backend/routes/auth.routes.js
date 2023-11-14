const Router = require('express')
const { emailRegister, logIn, googleLogIn, resetPassword } = require('../controllers/auth.controller.js')

const authRouter = Router()

authRouter.post('/email-register', emailRegister)
authRouter.post('/login', logIn)
authRouter.post('/google-login', googleLogIn)
authRouter.post('/reset-password', resetPassword)

module.exports = { authRouter }
