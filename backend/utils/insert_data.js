const admin = require('firebase-admin')
const serviceAccount = require('../firebase-key.json')
const recipes = require('../../data/recipes.json')
const ingredients = require('../../data/ingredients.json')
const { convertTitle } = require('./functions.js')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const insertIngredients = async () => {
    const batch = db.batch()
    ingredients.forEach((ingredient) => {
        const docId = ingredient.id.toString()
        const docIngredient = db.collection('ingredients').doc(docId)
        batch.set(docIngredient, ingredient)
    })
    result = await batch.commit()
}

const insertRecipes = async () => {
    const batch = db.batch()
    recipes.forEach((recipe) => {
        const docId = recipe.id.toString()
        recipe.urlTitle = convertTitle(recipe.title)
        const docRecipe = db.collection('recipes').doc(docId)
        batch.set(docRecipe, recipe)
    })
    result = await batch.commit()
}

insertIngredients()
insertRecipes()
