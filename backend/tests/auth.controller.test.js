const axios = require('axios')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const baseUrl = 'http://localhost:3000/api'

describe('email-register endpoint', () => {
    it('should create a user with valid data', async () => {
        const response = await axios.post(`${baseUrl}/email-register`, {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })

        expect(response.status).toBe(201)
        expect(response.data.user_id).toBeDefined()
    })

    it('should return 400 for missing fields', async () => {
        try {
            await axios.post(`${baseUrl}/email-register`, {
                user_name: 'testuser',
                full_name: 'Test User'
            })
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data.error).toContain(
                'Los campos user_name, full_name, email y password son obligatorios.'
            )
        }
    })
})

describe('login endpoint', () => {
    it('should log in a user with valid credentials', async () => {
        const response = await axios.post(`${baseUrl}/login`, {
            email: 'test@example.com',
            password: 'password123'
        })

        expect(response.status).toBe(200)
        expect(response.data.logged).toBeTruthy()
        expect(response.data.user_id).toBeDefined()
    })

    it('should return 400 for missing fields', async () => {
        try {
            await axios.post(`${baseUrl}/login`, {})
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data.error).toContain('Email y contraseña son requeridos')
        }
    })

    it('should return 400 for invalid email format', async () => {
        try {
            await axios.post(`${baseUrl}/login`, {
                email: 'invalid-email',
                password: 'password123'
            })
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data.error).toContain('Email inválido')
        }
    })

    it('should return 403 for invalid credentials', async () => {
        try {
            await axios.post(`${baseUrl}/login`, {
                email: 'test@example.com',
                password: 'wrongpassword'
            })
        } catch (error) {
            expect(error.response.status).toBe(403)
            expect(error.response.data.error).toContain('Usuario o Contraseña incorrectos')
        }
    })
})

describe('google-login endpoint', () => {
    it('should log in or register a user via Google', async () => {
        const response = await axios.post(`${baseUrl}/google-login`, {
            email: 'user@example.com',
            displayName: 'Example User',
            photoURL: 'http://example.com/photo.jpg'
        })

        expect(response.status).toBe(200)
        expect(response.data.logged).toBeTruthy()
        expect(response.data.user_id).toBeDefined()
        expect(response.data.full_name).toEqual('Example User')
        expect(response.data.email).toEqual('user@example.com')
        expect(response.data.image).toEqual('http://example.com/photo.jpg')
    })
})

describe('reset-password endpoint', () => {
    it('should send a password reset email for a valid email', async () => {
        const response = await axios.post(`${baseUrl}/reset-password`, {
            email: 'user@example.com'
        })

        expect(response.status).toBe(200)
        expect(response.data.reset).toBeTruthy()
    })

    it('should return 404 for non-existing email', async () => {
        try {
            await axios.post(`${baseUrl}/reset-password`, {
                email: 'nonexisting@example.com'
            })
        } catch (error) {
            expect(error.response.status).toBe(404)
            expect(error.response.data.error).toContain('No existe ninguna cuenta con este correo electrónico')
            expect(error.response.data.reset).toBeFalsy()
        }
    })
})

describe('logout endpoint', () => {
    it('should log out a user', async () => {
        const response = await axios.post(`${baseUrl}/logout`)

        expect(response.status).toBe(200)
        expect(response.data.logged).toBeFalsy()

        const cookie = response.headers['set-cookie'][0]
        expect(cookie).toContain('token=;')
    })
})

describe('verifyToken endpoint', () => {
    const JWT_SECRET = process.env.JWT_SECRET

    it('should verify a valid token', async () => {
        const validToken = jwt.sign({ user_id: 'xnVowxyD73V5SYn3t4MD' }, JWT_SECRET, { expiresIn: '1h' })
        const response = await axios.get(`${baseUrl}/verify-token`, {
            headers: { Cookie: `token=${validToken}` }
        })

        expect(response.status).toBe(200)
    })

    it('should return 401 for no token', async () => {
        try {
            await axios.get(`${baseUrl}/verify-token`)
        } catch (error) {
            expect(error.response.status).toBe(401)
            expect(error.response.data.error).toContain('No autorizado1')
        }
    })

    it('should return 401 for invalid token', async () => {
        const invalidToken = 'invalidToken'
        try {
            await axios.get(`${baseUrl}/verify-token`, {
                headers: { Cookie: `token=${invalidToken}` }
            })
        } catch (error) {
            expect(error.response.status).toBe(401)
            expect(error.response.data.error).toContain('No autorizado3')
        }
    })
})
