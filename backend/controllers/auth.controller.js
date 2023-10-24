const { User, WeeklyPlan } = require('../models/user.model.js')
const { db } = require('../utils/admin.js')
const { auth } = require('../utils/firebase.js')

const { createUserWithEmailAndPassword } = require('firebase/auth')

const emailRegister = async (req, res) => {
    const { user_name, full_name, email, password, image } = req.body

    try {
        await createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
            try {
                const newUser = new User(user_name, full_name, email, image)
                newUser.shopping_list = []
                newUser.weekly_plan = new WeeklyPlan()

                const jsonUser = JSON.stringify(newUser)
                const response = await db.collection('users').add(JSON.parse(jsonUser))
                res.status(201).json({ user_id: response._path.segments[1] })
            } catch (error) {
                console.error(error)
                res.status(500)
            }
        })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}

const logIn = async (req, res) => {
    res.send('Sign In')
}

module.exports = { emailRegister, logIn }
