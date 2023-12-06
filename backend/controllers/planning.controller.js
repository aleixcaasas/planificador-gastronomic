const { WeeklyPlan, Meal } = require('../models/user.model.js')
const { db } = require('../utils/firebase.js')

const getPlanning = async (req, res) => {
    const { user_id } = req.body
    const doc = await db.collection('users').doc(user_id).get()
    const user = doc.data()
    res.json(user.weekly_plan)
}

const deletePlanning = async (req, res) => {
    const { user_id } = req.body

    const newWeeklyPlan = new WeeklyPlan()

    await db.collection('users').doc(user_id).update({ weekly_plan: newWeeklyPlan.toFirestore() })

    res.json(newWeeklyPlan)
}

const addMeal = async (req, res) => {
    const { user_id, day, meal, recipe_id, recipe_title, recipe_image, recipe_time } = req.body
    const newMeal = {
        recipe_id: recipe_id,
        recipe_title: recipe_title,
        recipe_image: recipe_image,
        recipe_time: recipe_time
    }

    const doc = await db.collection('users').doc(user_id).get()
    const user = doc.data()

    user.weekly_plan[day][meal].push(newMeal)

    await db.collection('users').doc(user_id).update({ weekly_plan: user.weekly_plan })

    res.json(user.weekly_plan)
}

const deleteMeal = async (req, res) => {
    const { user_id, day, meal, recipe_id } = req.body

    const doc = await db.collection('users').doc(user_id).get()
    const user = doc.data()

    const newMeals = user.weekly_plan[day][meal].filter((meal) => meal.recipe_id !== recipe_id)

    user.weekly_plan[day][meal] = newMeals

    await db.collection('users').doc(user_id).update({ weekly_plan: user.weekly_plan })

    res.json(user.weekly_plan)
}

module.exports = { getPlanning, deletePlanning, addMeal, deleteMeal }
