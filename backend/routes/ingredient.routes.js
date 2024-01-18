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
ingredientRouter.get('/shoppingList', getShoppingList)
ingredientRouter.post('/add-ingredient', addIngredient)
ingredientRouter.post('/delete-ingredient', deleteIngredient)
ingredientRouter.post('/add-planning', addPlanningToShoppingList)
ingredientRouter.delete('/delete-shoppingList', resetShoppingList)

module.exports = { ingredientRouter }
