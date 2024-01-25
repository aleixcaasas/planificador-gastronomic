const ingredientController = require('../../controllers/ingredient.controller.js')
jest.mock('../../utils/firebase.js')

const { db } = require('../../utils/firebase.js')

describe('getIngredients', () => {
    it('should return a list of ingredients', async () => {
        // Simula la respuesta de Firebase
        db.collection.mockReturnValue({
            get: jest.fn().mockResolvedValue({
                docs: [{ id: '1', data: () => ({ name: 'Tomato', image: 'image_url' }) }]
            })
        })

        const req = {}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.getIngredients(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.any(Array))
    })
})

describe('getShoppingList', () => {
    it("should return the user's shopping list", async () => {
        const req = { user: { shopping_list: ['ingredient1', 'ingredient2'] } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.getShoppingList(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ shoppingList: expect.any(Array) })
    })
})

describe('addIngredient', () => {
    it('should add an ingredient if not already in the list', async () => {
        const req = {
            user: {
                user_id: 'userId',
                shopping_list: []
            },
            body: {
                ingredient: { id: 'ingredientId', name: 'Ingredient' }
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.addIngredient(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ shoppingList: expect.any(Array) })
    })

    it('should not add a duplicate ingredient', async () => {
        const req = {
            user: {
                user_id: 'userId',
                shopping_list: [{ id: 'ingredientId', name: 'Ingredient' }]
            },
            body: {
                ingredient: { id: 'ingredientId', name: 'Ingredient' }
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.addIngredient(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) })
    })
})

describe('deleteIngredient', () => {
    it('should remove an ingredient from the list', async () => {
        const req = {
            user: {
                user_id: 'userId',
                shopping_list: [{ id: 'ingredientId', name: 'Ingredient' }]
            },
            body: {
                ingredient_id: 'ingredientId'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.deleteIngredient(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ shoppingList: expect.any(Array) })
    })
})

describe('addPlanningToShoppingList', () => {
    it('should update the shopping list based on weekly planning', async () => {
        // Mock data
        const userFound = {
            user_id: 'userId',
            shopping_list: [],
            weekly_plan: {
                monday: { breakfast: [{ recipe_id: 'recipe1' }] }
            }
        }
        const recipeData = { parsed_ingredients: [{ id: 'ingredient1', name: 'Ingredient1' }] }

        // Mock Firebase responses
        db.collection()
            .doc()
            .get.mockResolvedValue({ data: () => recipeData })

        const req = { user: userFound }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.addPlanningToShoppingList(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }))
    })
})

describe('resetShoppingList', () => {
    it('should reset the shopping list of the user', async () => {
        const userFound = { user_id: 'userId', shopping_list: [{ id: 'ingredient1', name: 'Ingredient1' }] }

        const req = { user: userFound }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await ingredientController.resetShoppingList(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Lista de la compra reiniciada correctamente',
            shoppingList: []
        })
    })
})
