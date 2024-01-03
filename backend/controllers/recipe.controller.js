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
            time: data.time,
            meal: data.meal
        }
    })
    res.json(recipes)
}

const getUserRecipes = async (req, res) => {
    const { user_id } = req.body
    const snapshot = await db.collection('recipes').get()
    const allRecipes = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            title: data.title,
            image: data.image,
            difficulty: data.difficulty,
            time: data.time,
            user_id: data.user_id,
            meal: data.meal
        }
    })

    const recipes = allRecipes.filter((recipe) => {
        return recipe.user_id === user_id
    })

    res.json(recipes)
}

const createRecipe = async (req, res) => {
    const { title, description, ingredients, image, difficulty, steps, time, user_id, meal } = req.body

    const newRecipe = {
        title,
        description,
        ingredients,
        image,
        difficulty,
        steps,
        time,
        user_id,
        meal
    }

    const docRef = await db.collection('recipes').add(newRecipe)

    res.status(200).json({ id: docRef.id, ...newRecipe })
}

const addFavourite = async (req, res) => {}

const removeFavourite = async (req, res) => {}

module.exports = { getRecipes, getUserRecipes, createRecipe, addFavourite, removeFavourite }
