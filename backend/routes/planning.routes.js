const Router = require('express')
const { getPlanning, addMeal, deleteMeal } = require('../controllers/planning.controller.js')

const planningRouter = Router()

planningRouter.get('/planning', getPlanning)
planningRouter.post('/add-meal', addMeal)
planningRouter.post('/delete-meal', deleteMeal)

module.exports = { planningRouter }
