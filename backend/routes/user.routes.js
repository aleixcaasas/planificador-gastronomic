const Router = require('express')
const { getUser, updateUser } = require('../controllers/user.controller.js')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const userRouter = Router()

userRouter.get('/user', getUser)
userRouter.patch('/update-user', upload.single('image'), updateUser)

module.exports = { userRouter }
