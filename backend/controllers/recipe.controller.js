const { WeeklyPlan } = require('../models/user.model.js')
const { db } = require('../utils/firebase.js')

const getRecipes = async (req, res) => {
    const snapshot = await db.collection('recipes').get()
    const recipes = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            title: data.title,
            image: data.image,
            difficulty: data.difficulty,
            time: data.time
        }
    })
    res.json(recipes)
}

const addMeal = async (req, res) => {}

const addFavourite = async (req, res) => {}

const removeFavourite = async (req, res) => {}

module.exports = { getRecipes, addMeal, addFavourite, removeFavourite }
