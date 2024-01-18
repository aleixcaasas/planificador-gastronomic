const Router = require('express')
const { getPlanning, deletePlanning, addMeal, deleteMeal } = require('../controllers/planning.controller.js')

const planningRouter = Router()

planningRouter.get('/planning', getPlanning)
planningRouter.post('/add-meal', addMeal)
planningRouter.post('/delete-meal', deleteMeal)
planningRouter.delete('/delete-planning', deletePlanning)

module.exports = { planningRouter }
