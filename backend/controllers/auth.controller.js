const { User, WeeklyPlan } = require('../models/user.model.js')
const { db, auth } = require('../utils/firebase.js')

const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth')

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
                res.status(500).json({ error: error })
            }
        })
    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}

const logIn = async (req, res) => {
    const { email, password } = req.body

    try {
        await signInWithEmailAndPassword(auth, email, password).then((result) => {
            res.status(200).json({ user_id: result.user.uid, loged: true })
        })
    } catch (error) {
        res.status(500).json({ loged: false })
        console.log(error)
    }
}

const googleLogIn = async (req, res) => {
    const user = req.body
    try {
        console.log(user)
        const user_name = user.email.split('@')[0]
        const full_name = user.displayName
        const email = user.email
        const image = user.photoURL
        const emailUsed = await isEmailUsed(email)

        if (!emailUsed) {
            const newUser = new User(user_name, full_name, email, image)
            newUser.shopping_list = []
            newUser.weekly_plan = new WeeklyPlan()

            const jsonUser = JSON.stringify(newUser)
            const response = await db.collection('users').add(JSON.parse(jsonUser))
            res.status(201).json({ user_id: response._path.segments[1] })
        } else {
            res.status(200).json({ user_id: result.user.uid, loged: true })
        }
    } catch (error) {
        res.status(500).json({ loged: false })
        console.log(error)
    }
}

const resetPassword = async (email) => {
    try {
        if (await isEmailUsed(email)) {
            await sendPasswordResetEmail(email)
            res.status(200).json({ reset: true })
        } else {
            res.status(200).json({ reset: false })
        }
    } catch (error) {
        res.status(500).json({ reset: false })
        console.log(error)
    }
}

const isEmailUsed = async (email) => {
    const user = await db.collection('users').where('email', '==', email).get()
    return user.docs.length > 0
}

module.exports = { emailRegister, logIn, googleLogIn, resetPassword }
