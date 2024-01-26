const recipeController = require('../../controllers/recipe.controller')
jest.mock('../../utils/firebase.js')
jest.mock('../../utils/functions.js', () => ({
    convertTitle: jest.fn().mockImplementation((title) => title.replace(/\s+/g, '-').toLowerCase())
}))

const { db, getDownloadURL, uploadBytesResumable } = require('../../utils/firebase.js')

jest.mock('../../utils/firebase.js', () => {
    const mockGetDownloadURL = jest.fn().mockResolvedValue('download_url')
    return {
        db: {
            collection: jest.fn().mockReturnThis(),
            doc: jest.fn().mockReturnThis(),
            update: jest.fn().mockResolvedValue({}),
            get: jest.fn().mockResolvedValue({
                data: () => ({
                    /* datos simulados */
                })
            }),
            add: jest.fn().mockResolvedValue({ id: 'newDocumentId' })
        },
        ref: jest.fn(() => ({
            put: jest.fn().mockResolvedValue({
                state: 'success',
                ref: {
                    getDownloadURL: mockGetDownloadURL
                }
            })
        })),
        uploadBytesResumable: jest.fn(() => ({
            on: jest.fn((_, onSuccess) =>
                onSuccess({
                    state: 'success',
                    ref: {
                        getDownloadURL: mockGetDownloadURL
                    }
                })
            )
        })),
        getDownloadURL: mockGetDownloadURL
    }
})

describe('getRecipes', () => {
    it('should return a list of recipes', async () => {
        db.collection().get.mockResolvedValue({
            docs: [
                {
                    id: '1',
                    data: () => ({
                        title: 'Recipe 1',
                        image: 'image_url',
                        difficulty: 'Easy',
                        time: '30 min',
                        meal: 'Breakfast'
                    })
                }
            ]
        })

        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.getRecipes(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.any(Array))
    })
})

describe('getUserRecipes', () => {
    it('should return recipes created by the user', async () => {
        db.collection().get.mockResolvedValue({
            docs: [
                { id: '1', data: () => ({ title: 'Recipe 1', user_id: 'userId' }) },
                { id: '2', data: () => ({ title: 'Recipe 2', user_id: 'anotherUserId' }) }
            ]
        })

        const req = { user: { user_id: 'userId' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.getUserRecipes(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ user_id: 'userId' })]))
    })
})

describe('getRecipe', () => {
    it('should return a recipe by numeric ID', async () => {
        const recipeData = { title: 'Recipe Title' }
        db.collection()
            .doc()
            .get.mockResolvedValue({ data: () => recipeData })

        const req = { params: { parameter: '1' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.getRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(recipeData)
    })

    it('should return a recipe by title', async () => {
        const recipeData = { urlTitle: 'pasta-alfredo-con-pollo' }
        db.collection().get.mockResolvedValue({
            docs: [{ data: () => recipeData }]
        })

        const req = { params: { parameter: 'pasta-alfredo-con-pollo' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.getRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(recipeData)
    })

    it('should return 404 if recipe is not found', async () => {
        db.collection().doc().get.mockResolvedValue(null)
        db.collection().get.mockResolvedValue({ docs: [] })

        const req = { params: { parameter: 'non-existing' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.getRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith('Receta no encontrada')
    })
})

describe('createRecipe', () => {
    it('should create and return a new recipe', async () => {
        const parsed_ingredients = JSON.stringify([{ id: 'ing1', name: 'Ingredient 1' }])

        const steps = 'Step 1\nStep 2'

        const time = '30'
        const title = 'New Recipe'

        const fileMock = { mimetype: 'image/jpeg', buffer: Buffer.from('') }
        uploadBytesResumable.mockResolvedValue({
            state: 'success',
            ref: {
                getDownloadURL: jest.fn().mockResolvedValue('download_url')
            }
        })
        getDownloadURL.mockResolvedValue('download_url')

        // Mock para la adición de la receta en la base de datos
        db.collection().add.mockResolvedValue({ id: 'newRecipeId' })

        // Datos de solicitud
        const req = {
            user: { user_id: 'userId' },
            body: {
                title: title,
                description: 'Recipe description',
                parsed_ingredients: parsed_ingredients,
                difficulty: 'Easy',
                steps: steps,
                time: time,
                meal: 'Breakfast'
            },
            file: fileMock
        }

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.createRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should handle errors during recipe creation', async () => {
        const fileMock = { mimetype: 'image/jpeg', buffer: Buffer.from('') }
        uploadBytesResumable.mockRejectedValue(new Error('Error en la carga'))

        const req = {
            user: { user_id: 'userId' },
            body: {
                title: 'New Recipe',
                description: 'Recipe description',
                parsed_ingredients: JSON.stringify([{ id: 'ing1', name: 'Ingredient 1' }]),
                difficulty: 'Easy',
                steps: 'Step 1\nStep 2',
                time: '30',
                meal: 'Breakfast'
            },
            file: {
                mimetype: 'image/jpeg',
                buffer: Buffer.from('image data', 'utf-8')
            }
        }

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

        await recipeController.createRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.anything() }))
    })
})
