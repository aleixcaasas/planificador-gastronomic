const { WeeklyPlan } = require('../models/user.model.js')
const { db } = require('../utils/firebase.js')

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
    const { user_id } = req.body

    const doc = await db.collection('users').doc(user_id).get()
    const user = doc.data()
    const shoppingList = user.shopping_list

    res.status(200).json({ shoppingList })
}

const addIngredient = async (req, res) => {
    const { user_id, ingredient } = req.body

    const doc = await db.collection('users').doc(user_id).get()
    const user = doc.data()
    const shoppingList = user.shopping_list

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
    const { user_id, ingredient_id } = req.body

    const doc = await db.collection('users').doc(user_id).get()
    const user = doc.data()
    const shoppingList = user.shopping_list

    const newShoppingList = shoppingList.filter((item) => item.id !== ingredient_id)

    await db.collection('users').doc(user_id).update({ shopping_list: newShoppingList })

    res.status(200).json({ shoppingList: newShoppingList })
}

const addPlanningToShoppingList = async (req, res) => {}

const resetShoppingList = async (req, res) => {}

module.exports = {
    getIngredients,
    getShoppingList,
    addIngredient,
    deleteIngredient,
    addPlanningToShoppingList,
    resetShoppingList
}
