const recipeController = require('../../controllers/recipe.controller')
jest.mock('../../utils/firebase.js')
jest.mock('../../utils/functions.js', () => ({
    convertTitle: jest.fn().mockImplementation((title) => title.replace(/\s+/g, '-').toLowerCase())
}))

const { db, getDownloadURL, storage, ref, uploadBytesResumable } = require('../../utils/firebase.js')
const { convertTitle } = require('../../utils/functions.js')

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
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

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
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await recipeController.getUserRecipes(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ user_id: 'userId' })]))
    })
})

describe('getRecipe', () => {
    it('should return a recipe by numeric ID', async () => {
        const recipeData = { title: 'Recipe Title' /* otras propiedades */ }
        db.collection()
            .doc()
            .get.mockResolvedValue({ data: () => recipeData })

        const req = { params: { parameter: '1' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await recipeController.getRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(recipeData)
    })

    it('should return a recipe by title', async () => {
        const recipeData = { title: 'Recipe Title' /* otras propiedades */ }
        db.collection().get.mockResolvedValue({ docs: [{ data: () => recipeData }] })

        const req = { params: { parameter: 'recipe-title' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await recipeController.getRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(recipeData)
    })

    it('should return 404 if recipe is not found', async () => {
        db.collection().doc().get.mockResolvedValue(null)
        db.collection().get.mockResolvedValue({ docs: [] })

        const req = { params: { parameter: 'non-existing' } }
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }

        await recipeController.getRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith('Receta no encontrada')
    })
})

describe('createRecipe', () => {
    it('should create and return a new recipe', async () => {
        const fileMock = { mimetype: 'image/jpeg', buffer: Buffer.from('') }
        ref.mockReturnValue({
            /* Objeto de referencia de Firebase Storage */
        })
        uploadBytesResumable.mockResolvedValue({
            /* Mock de respuesta de Firebase Storage */
        })
        getDownloadURL.mockResolvedValue('download_url')
        db.collection().add.mockResolvedValue({ id: 'newRecipeId' })

        const req = {
            user: { user_id: 'userId' },
            body: {
                /* datos de la receta */
            },
            file: fileMock
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await recipeController.createRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'newRecipeId' }))
    })

    it('should handle errors during recipe creation', async () => {
        // Simula un error, como un fallo en la carga de la imagen
        const fileMock = { mimetype: 'image/jpeg', buffer: Buffer.from('') }
        uploadBytesResumable.mockRejectedValue(new Error('Error en la carga'))

        const req = {
            /* ... */
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

        await recipeController.createRecipe(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.anything() }))
    })
})
