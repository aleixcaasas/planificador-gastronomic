const { WeeklyPlan } = require('../models/user.model.js')
const { db } = require('../utils/firebase.js')
const jwt = require('jsonwebtoken')
const { getUser } = require('../utils/queries.js')

const getIngredients = async (req, res) => {
    const snapshot = await db.collection('ingredients').get()
    const ingredients = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            name: data.name,
            image: data.image
        }
    })
    res.status(200).json(ingredients)
}

const getShoppingList = async (req, res) => {
    const shoppingList = req.user.shopping_list

    res.status(200).json({ shoppingList })
}

const addIngredient = async (req, res) => {
    const { user_id } = req.user
    const { ingredient } = req.body

    const shoppingList = req.user.shopping_list

    const ingredientExists = shoppingList.find((item) => item.id === ingredient.id)

    if (ingredientExists) {
        res.status(400).json({ message: 'Este ingrediente ya está en la lista de la compra' })
    } else {
        shoppingList.push(ingredient)

        await db.collection('users').doc(user_id).update({ shopping_list: shoppingList })

        res.status(200).json({ shoppingList })
    }
}

const deleteIngredient = async (req, res) => {
    const { ingredient_id } = req.body
    const { user_id } = req.user
    const shoppingList = req.user.shopping_list

    const newShoppingList = shoppingList.filter((item) => item.id !== ingredient_id)

    await db.collection('users').doc(user_id).update({ shopping_list: newShoppingList })

    res.status(200).json({ shoppingList: newShoppingList })
}

const addPlanningToShoppingList = async (req, res) => {
    try {
        const userFound = req.user

        // Extraer los IDs de las recetas de la planificación semanal y eliminar duplicados
        const recipeIds = [
            ...new Set(
                Object.values(userFound.weekly_plan).flatMap((day) =>
                    Object.values(day).flatMap((meal) => meal.map((recipe) => recipe.recipe_id))
                )
            )
        ]

        // Recuperar las recetas por sus IDs de documento
        const recipesPromises = recipeIds.map((id) => db.collection('recipes').doc(id).get())
        const recipeSnapshots = await Promise.all(recipesPromises)
        const recipeList = recipeSnapshots.map((snapshot) => ({ ...snapshot.data(), recipe_id: snapshot.id }))

        // Procesar los ingredientes de las recetas encontradas
        const planificationIngredients = recipeList.flatMap((recipe) => recipe.parsed_ingredients || [])

        // Aplanar planificationIngredients a un solo nivel
        const flattenedIngredients = planificationIngredients.flat()

        // Eliminar ingredientes duplicados basados en el id
        const uniqueIngredients = []
        const seenIds = new Set()

        for (const ingredient of userFound.shopping_list.concat(flattenedIngredients)) {
            if (!seenIds.has(ingredient.id)) {
                seenIds.add(ingredient.id)
                uniqueIngredients.push(ingredient)
            }
        }

        await db.collection('users').doc(userFound.user_id).update({ shopping_list: uniqueIngredients })

        res.status(200).json({
            message: 'Lista de la compra actualizada correctamente',
            shoppingList: uniqueIngredients
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

const resetShoppingList = async (req, res) => {
    try {
        const userFound = req.user

        await db.collection('users').doc(userFound.user_id).update({ shopping_list: [] })

        res.status(200).json({
            message: 'Lista de la compra reiniciada correctamente',
            shoppingList: []
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

module.exports = {
    getIngredients,
    getShoppingList,
    addIngredient,
    deleteIngredient,
    addPlanningToShoppingList,
    resetShoppingList
}
