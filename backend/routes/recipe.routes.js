const Router = require('express')
const multer = require('multer')
const { getRecipes, getUserRecipes, getRecipe, createRecipe } = require('../controllers/recipe.controller.js')
const upload = multer({ storage: multer.memoryStorage() })

const recipeRouter = Router()

recipeRouter.get('/recipes', getRecipes)
recipeRouter.get('/recipe/:parameter', getRecipe)
recipeRouter.get('/user-recipes', getUserRecipes)
recipeRouter.post('/new-recipe', upload.single('image_data'), createRecipe)

module.exports = { recipeRouter }
