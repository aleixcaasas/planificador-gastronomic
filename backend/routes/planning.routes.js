const Router = require('express')
const { getPlanning, deletePlanning, addMeal, deleteMeal } = require('../controllers/planning.controller.js')

const planningRouter = Router()

planningRouter.post('/planning', getPlanning)
planningRouter.post('/delete-planning', deletePlanning)
planningRouter.post('/add-meal', addMeal)
planningRouter.post('/delete-meal', deleteMeal)

module.exports = { planningRouter }
