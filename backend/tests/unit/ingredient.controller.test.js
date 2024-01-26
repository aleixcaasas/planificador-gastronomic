const ingredientController = require('../../controllers/ingredient.controller.js')
jest.mock('../../utils/firebase.js')

const { db } = require('../../utils/firebase.js')

jest.mock('../../utils/firebase.js', () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn(() =>
            Promise.resolve({
                docs: [{ id: '1', data: () => ({ name: 'Tomato', image: 'image_url' }) }]
            })
        ),
        update: jest.fn(() => Promise.resolve()),
        set: jest.fn(() => Promise.resolve()),
        add: jest.fn(() => Promise.resolve({ id: 'newDocumentId' }))
    }
}))

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
