const axios = require('axios')
const baseUrl = 'http://localhost:3000/api'
const testCookie =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiS1dsT0xGNFdtcnJ2eTdldW1UZlciLCJpYXQiOjE3MDYyMDA4NDAsImV4cCI6MTcwODc5Mjg0MH0.79RFCNM-3xrI0YMH07YyEgEm8J4LoVZikJxw6X6Mg7k'
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

describe('recipes endpoint', () => {
    it('should retrieve all recipes', async () => {
        const response = await axios.get(`${baseUrl}/recipes`, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(Array.isArray(response.data)).toBeTruthy()
        response.data.forEach((recipe) => {
            expect(recipe).toHaveProperty('id')
            expect(recipe).toHaveProperty('title')
        })
    })
})

describe('user-recipes endpoint', () => {
    it('should retrieve recipes for the authenticated user', async () => {
        const response = await axios.get(`${baseUrl}/user-recipes`, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(Array.isArray(response.data)).toBeTruthy()
        response.data.forEach((recipe) => {
            expect(recipe).toHaveProperty('id')
            expect(recipe).toHaveProperty('user_id')
        })
    })
})

describe('recipe endpoint', () => {
    it('should retrieve a recipe by ID', async () => {
        const recipeId = 1
        const response = await axios.get(`${baseUrl}/recipe/${recipeId}`, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('id', recipeId)
    })

    it('should retrieve a recipe by name', async () => {
        const recipeName = 'pasta-alfredo-con-pollo'
        const response = await axios.get(`${baseUrl}/recipe/${recipeName}`, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('urlTitle', recipeName)
    })

    it('should return 404 for a non-existent recipe', async () => {
        const nonExistentRecipe = 'non-existent-recipe'
        try {
            await axios.get(`${baseUrl}/recipe/${nonExistentRecipe}`, {
                headers: { Cookie: testCookie }
            })
        } catch (error) {
            expect(error.response.status).toBe(404)
        }
    })
})

describe('new-recipe endpoint', () => {
    it('should create a new recipe with an image', async () => {
        const formData = new FormData()
        formData.append('title', 'New Recipe')
        formData.append('description', 'Recipe description')
        formData.append('parsed_ingredients', JSON.stringify([{ ingredient: 'Tomato', quantity: '2' }]))
        formData.append('difficulty', 'Easy')
        formData.append('steps', 'Step 1\nStep 2')
        formData.append('time', '30')
        formData.append('meal', 'Dinner')
        formData.append('image_data', fs.createReadStream(path.join(__dirname, 'test-image.png')))

        const response = await axios.post(`${baseUrl}/new-recipe`, formData, {
            headers: {
                ...formData.getHeaders(),
                Cookie: testCookie
            }
        })

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('id')
    })
})
