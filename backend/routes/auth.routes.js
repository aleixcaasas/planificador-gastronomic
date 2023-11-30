const Router = require('express')
const {
    emailRegister,
    logIn,
    googleLogIn,
    resetPassword,
    logout,
    verifyToken
} = require('../controllers/auth.controller.js')
const { auth } = require('../utils/firebase.js')

const authRouter = Router()

authRouter.post('/email-register', emailRegister)
authRouter.post('/login', logIn)
authRouter.post('/google-login', googleLogIn)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/logout', logout)
authRouter.get('/verify-token', verifyToken)

module.exports = { authRouter }
