const { User, WeeklyPlan } = require('../models/user.model.js')
const { db, auth } = require('../utils/firebase.js')
const jwt = require('jsonwebtoken')

const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth')

const emailRegister = async (req, res) => {
    const { user_name, full_name, email, password } = req.body

    if (!user_name || !full_name || !email || !password) {
        return res.status(400).json({ error: 'Los campos user_name, full_name, email y password son obligatorios.' })
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password)
        try {
            const image = null
            const newUser = new User(user_name, full_name, email, image)
            newUser.shopping_list = []
            newUser.weekly_plan = new WeeklyPlan()

            const jsonUser = JSON.stringify(newUser)
            const response = await db.collection('users').add(JSON.parse(jsonUser))
            res.status(201).json({ user_id: response._path.segments[1] })
        } catch (dbError) {
            console.error(dbError)
            res.status(500).json({ error: 'Error al crear el usuario en la base de datos.' })
        }
    } catch (authError) {
        console.error(authError)
        if (authError.code === 'auth/email-already-in-use') {
            res.status(409).json({ error: 'El email ya está en uso.' })
        } else {
            res.status(500).json({ error: 'Error al crear el usuario con autenticación.' })
        }
    }
}

const logIn = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' })
    }

    try {
        await signInWithEmailAndPassword(auth, email, password).then((result) => {
            jwt.sign({ user_id: result.user.uid }, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
                if (err) console.log(error)
                res.cookie('token', token, {
                    httpOnly: false,
                    secure: true,
                    /*sameSite: 'None',*/
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })
                res.status(200).json({ logged: true, user_id: result.user.uid })
            })
        })
    } catch (error) {
        if (error.code === 'auth/invalid-login-credentials') {
            res.status(403).json({ error: 'Usuario o Contraseña incorrectos', logged: false })
        } else {
            console.log(error)
            res.status(500).json({ error: 'Error interno del servidor', logged: false })
        }
    }
}

const googleLogIn = async (req, res) => {
    const user = req.body

    try {
        const user_name = user.email.split('@')[0]
        const full_name = user.displayName
        const email = user.email
        const image = user.photoURL
        const emailUsed = await isEmailUsed(email)

        let userId

        if (!emailUsed) {
            const newUser = new User(user_name, full_name, email, image)
            newUser.shopping_list = []
            newUser.weekly_plan = new WeeklyPlan()

            const jsonUser = JSON.stringify(newUser)
            const response = await db.collection('users').add(JSON.parse(jsonUser))
            userId = response._path.segments[1]
        } else {
            const users = await db.collection('users').where('email', '==', email).get()
            if (!users.empty) {
                const userDoc = users.docs[0]
                userId = userDoc.id
            } else {
                return res.status(404).json({ logged: false, error: 'User not found' })
            }
        }

        jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ logged: false, error: 'Error generating token' })
            }

            res.cookie('token', token, {
                httpOnly: false,
                secure: true,
                /* sameSite: 'None', */
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                logged: true,
                user_id: userId,
                full_name: full_name,
                email: email,
                image: image
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ logged: false, error: 'Internal Server Error' })
    }
}

const resetPassword = async (req, res) => {
    const { email } = req.body
    try {
        const emailExists = await isEmailUsed(email)
        if (!emailExists) {
            return res.status(404).json({ error: 'No existe ninguna cuenta con este correo electrónico', reset: false })
        }

        await sendPasswordResetEmail(auth, email)
        res.status(200).json({ reset: true })
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', reset: false })
        console.log(error)
    }
}

const isEmailUsed = async (email) => {
    const user = await db.collection('users').where('email', '==', email).get()
    return user.docs.length > 0
}

const logout = (req, res) => {
    res.cookie('token', '', { expires: new Date(0), maxAge: 1 })
    res.status(200).json({ logged: false })
}

const verifyToken = (req, res) => {
    const token = req.headers.cookie.split('=')[1]
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ error: 'No autorizado' })
        }

        const userFound = getUser(decoded.user_id)
        if (!userFound) {
            return res.status(401).json({ error: 'No autorizado' })
        }

        return res.status(200).json({
            logged: true,
            user_id: decoded.user_id,
            user_name: userFound.user_name,
            full_name: userFound.full_name,
            email: userFound.email,
            image: userFound.image
        })
    })
}

const getUser = async (user_id) => {
    const user = await db.collection('users').doc(user_id).get()
    return user.data()
}

module.exports = { emailRegister, logIn, googleLogIn, resetPassword, logout, verifyToken }
