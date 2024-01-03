const Router = require('express')
const {
    getRecipes,
    getUserRecipes,
    createRecipe,
    addFavourite,
    removeFavourite
} = require('../controllers/recipe.controller.js')

const recipeRouter = Router()

recipeRouter.get('/recipes', getRecipes)
recipeRouter.post('/new-recipe', createRecipe)
recipeRouter.post('/add-favourite', addFavourite)
recipeRouter.post('/remove-favourite', removeFavourite)
recipeRouter.post('/user-recipes', getUserRecipes)

module.exports = { recipeRouter }
