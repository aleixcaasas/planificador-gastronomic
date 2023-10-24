const { User, ShoppingListItem, WeeklyPlan } = require('../models/user.model.js')
const { db } = require('../utils/admin.js')

const emailRegister = async (req, res) => {
    const { user_name, full_name, email, password, image } = req.body

    try {
        const newUser = new User(user_name, full_name, email, password, image)
        newUser.shopping_list = []
        newUser.weekly_plan = new WeeklyPlan()

        const jsonUser = JSON.stringify(newUser)
        const response = await db.collection('users').doc('1').set(JSON.parse(jsonUser))
        res.status(200).json({ result: response })
    } catch (error) {
        console.log(error)
    }
    res.send('Sign Up')
}

const logIn = async (req, res) => {
    res.send('Sign In')
}

module.exports = { emailRegister, logIn }
