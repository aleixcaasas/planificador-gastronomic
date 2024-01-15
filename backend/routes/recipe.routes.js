const Router = require('express')
const multer = require('multer')
const {
    getRecipes,
    getUserRecipes,
    createRecipe,
    addFavourite,
    removeFavourite
} = require('../controllers/recipe.controller.js')
const upload = multer({ storage: multer.memoryStorage() })

const recipeRouter = Router()

recipeRouter.get('/recipes', getRecipes)
recipeRouter.post('/new-recipe', upload.single('image_data'), createRecipe)
recipeRouter.post('/add-favourite', addFavourite)
recipeRouter.post('/remove-favourite', removeFavourite)
recipeRouter.post('/user-recipes', getUserRecipes)

module.exports = { recipeRouter }
