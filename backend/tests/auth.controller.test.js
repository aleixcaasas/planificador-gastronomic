const request = require('supertest')
const app = require('../utils/firebase.js')
const { createUserWithEmailAndPassword } = require('../controllers/auth.controller.js')
const { db } = require('../utils/admin.js')
const { User, WeeklyPlan } = require('../models/user.model.js')

jest.mock('firebase/auth')

describe('POST /email-register', () => {
    // existing tests

    it('should return a 500 status code if there is an error creating the user in the database', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            image: 'https://example.com/image.jpg'
        }
        const mockUserJson = JSON.stringify(
            new User(mockUser.user_name, mockUser.full_name, mockUser.email, mockUser.password, mockUser.image)
        )
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
        expect(db.collection().add).toHaveBeenCalledWith(JSON.parse(mockUserJson))
        expect(response.status).toBe(500)
    })

    it('should return a 500 status code if there is an error creating the user in Firebase', async () => {
        const mockUser = {
            user_name: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            image: 'https://example.com/image.jpg'
        }
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Firebase error'))

        const response = await request(app).post('/email-register').send(mockUser)

        expect(response.status).toBe(500)
    })
})
