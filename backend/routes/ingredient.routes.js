const Router = require('express')
const {
    getIngredients,
    getShoppingList,
    addIngredient,
    deleteIngredient,
    addPlanningToShoppingList,
    resetShoppingList
} = require('../controllers/ingredient.controller.js')

const ingredientRouter = Router()

ingredientRouter.get('/ingredients', getIngredients)
ingredientRouter.post('/shoppingList', getShoppingList)
ingredientRouter.post('/delete-shoppingList', resetShoppingList)
ingredientRouter.post('/add-ingredient', addIngredient)
ingredientRouter.post('/delete-ingredient', deleteIngredient)
ingredientRouter.post('/add-planning', addPlanningToShoppingList)

module.exports = { ingredientRouter }
