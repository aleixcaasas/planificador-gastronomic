// Importaciones para el Cliente SDK
const { initializeApp: initializeClientApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')

// Importación para el Admin SDK
const admin = require('firebase-admin')

// Configuración del Cliente SDK
const clientConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

// Inicialización del Cliente SDK
const app = initializeClientApp(clientConfig)
const auth = getAuth(app)

// Configuración del Admin SDK
const serviceAccount = require('../firebase-key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

// Exportaciones
module.exports = {
    app,
    auth,
    admin,
    db
}
