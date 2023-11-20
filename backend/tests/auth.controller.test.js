const request = require('supertest')
const { createUserWithEmailAndPassword } = require('firebase/auth')
const { db } = require('../utils/firebase.js')
const { User, WeeklyPlan } = require('../models/user.model.js')

// Simulación de firebase/auth y firebase.js
jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'), // Conserva las exportaciones originales
    createUserWithEmailAndPassword: jest.fn() // Simula esta función
}))

jest.mock('../utils/firebase.js', () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        add: jest.fn()
    },
    // Asegúrate de que `app` se simula correctamente como una aplicación Express
    app: jest.fn(() => ({
        post: jest.fn().mockReturnThis(),
        send: jest.fn()
    }))
}))

describe('POST /email-register', () => {
    it('should return a 500 status code if there is an error creating the user in the database', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        }

        createUserWithEmailAndPassword.mockResolvedValueOnce({}) // Asegúrate de que esta función se simula correctamente
        db.collection.mockReturnValueOnce({
            add: jest.fn().mockRejectedValueOnce(new Error('Database error'))
        })

        const response = await request(app).post('/email-register').send(mockUser)

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Los campos user_name, full_name, email y password son obligatorios.' })
    })

    it('should return a 201 status code and user_id if the user is successfully registered', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        }

        auth.createUserWithEmailAndPassword.mockResolvedValueOnce({})
        db.collection.mockReturnValueOnce({
            add: jest.fn().mockResolvedValueOnce({ _path: { segments: ['users', '1234567890'] } })
        })

        const response = await request(app).post('/email-register').send(mockUser)

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            mockUser.email,
            mockUser.password
        )
        expect(db.collection).toHaveBeenCalledWith('users')
        expect(db.collection().add).toHaveBeenCalledWith(expect.any(Object))
        expect(response.status).toBe(201)
        expect(response.body).toEqual({ user_id: '1234567890' })
    })

    it('should return a 500 status code if there is an error creating the user in the database', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        }

        createUserWithEmailAndPassword.mockResolvedValueOnce({})
        db.collection.mockReturnValueOnce({
            add: jest.fn().mockRejectedValueOnce(new Error('Database error'))
        })

        const response = await request(app).post('/email-register').send(mockUser)

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            mockUser.email,
            mockUser.password
        )
        expect(db.collection).toHaveBeenCalledWith('users')
        expect(db.collection().add).toHaveBeenCalledWith(expect.any(Object))
        expect(response.status).toBe(500)
        expect(response.body).toEqual({ error: 'Error al crear el usuario en la base de datos.' })
    })

    it('should return a 409 status code if the email is already in use', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        }

        createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use' })

        const response = await request(app).post('/email-register').send(mockUser)

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            mockUser.email,
            mockUser.password
        )
        expect(response.status).toBe(409)
        expect(response.body).toEqual({ error: 'El email ya está en uso.' })
    })

    it('should return a 500 status code if there is an error creating the user with authentication', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        }

        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Firebase error'))

        const response = await request(app).post('/email-register').send(mockUser)

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            mockUser.email,
            mockUser.password
        )
        expect(response.status).toBe(500)
        expect(response.body).toEqual({ error: 'Error al crear el usuario con autenticación.' })
    })
})
