const axios = require('axios')
const baseUrl = 'http://localhost:3000/api'
const testCookie =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiS1dsT0xGNFdtcnJ2eTdldW1UZlciLCJpYXQiOjE3MDYyMDA4NDAsImV4cCI6MTcwODc5Mjg0MH0.79RFCNM-3xrI0YMH07YyEgEm8J4LoVZikJxw6X6Mg7k'

describe('ingredients endpoint with authentication', () => {
    it('should retrieve all ingredients with valid authentication', async () => {
        const response = await axios.get(`${baseUrl}/ingredients`, {
            headers: {
                Cookie: testCookie
            }
        })
        expect(response.status).toBe(200)
        expect(Array.isArray(response.data)).toBeTruthy()
    })
})

describe('shoppingList endpoint', () => {
    it("should retrieve the user's shopping list", async () => {
        const response = await axios.get(`${baseUrl}/shoppingList`, {
            headers: { Cookie: testCookie }
        })
        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('shoppingList')
    })
})

describe('add-ingredient endpoint', () => {
    it('should add an ingredient to the shopping list', async () => {
        const ingredient = { id: 'newIngredientId2', name: 'New Ingredient', image: 'image_url' }
        const addResponse = await axios.post(
            `${baseUrl}/add-ingredient`,
            { ingredient },
            {
                headers: { Cookie: testCookie }
            }
        )
        expect(addResponse.status).toBe(200)
        expect(addResponse.data.shoppingList).toContainEqual(ingredient)
    })

    it('should not add a duplicate ingredient to the shopping list', async () => {
        const duplicateIngredient = { id: 'existingIngredientId', name: 'Existing Ingredient', image: 'image_url' }
        try {
            await axios.post(
                `${baseUrl}/add-ingredient`,
                { ingredient: duplicateIngredient },
                {
                    headers: { Cookie: testCookie }
                }
            )
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data.message).toContain('Este ingrediente ya está en la lista de la compra')
        }
    })
})

describe('delete-ingredient endpoint', () => {
    it('should remove an ingredient from the shopping list', async () => {
        const ingredientIdToRemove = 'ingredientIdToRemove'
        const deleteResponse = await axios.post(
            `${baseUrl}/delete-ingredient`,
            { ingredient_id: ingredientIdToRemove },
            {
                headers: { Cookie: testCookie }
            }
        )
        expect(deleteResponse.status).toBe(200)
        expect(deleteResponse.data.shoppingList).not.toContainEqual({ id: ingredientIdToRemove })
    })
})

describe('add-planning endpoint', () => {
    it('should update the shopping list based on weekly planning', async () => {
        // Aquest test depèn de l'estat actual de l'usuari i la seva planificació setmanal
        const response = await axios.post(`${baseUrl}/add-planning`, null, {
            headers: { Cookie: testCookie }
        })
        expect(response.status).toBe(200)
        expect(response.data.message).toContain('Lista de la compra actualizada correctamente')
        expect(Array.isArray(response.data.shoppingList)).toBeTruthy()
    })
})

describe('delete-shoppingList endpoint', () => {
    it('should reset the shopping list', async () => {
        const response = await axios.delete(`${baseUrl}/delete-shoppingList`, {
            headers: { Cookie: testCookie }
        })
        expect(response.status).toBe(200)
        expect(response.data.message).toContain('Lista de la compra reiniciada correctamente')
        expect(response.data.shoppingList).toEqual([])
    })
})
