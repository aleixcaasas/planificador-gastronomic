const Router = require('express')
const { getRecipes, addMeal, addFavourite, removeFavourite } = require('../controllers/recipe.controller.js')

const recipeRouter = Router()

recipeRouter.get('/recipes', getRecipes)
recipeRouter.post('/new-recipe', addMeal)
recipeRouter.post('/add-favourite', addFavourite)
recipeRouter.post('/remove-favourite', removeFavourite)

module.exports = { recipeRouter }
