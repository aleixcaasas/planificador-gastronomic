const { db, getDownloadURL, storage, ref, uploadBytesResumable } = require('../utils/firebase.js')
const { convertTitle } = require('../utils/functions.js')

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
    const { title, description, parsed_ingredients, difficulty, steps, time, user_id, meal } = req.body
    const newTime = time + ' min'

    const { file } = req

    const newRecipe = {
        title,
        description,
        parsed_ingredients,
        difficulty,
        steps,
        time: newTime,
        user_id,
        meal
    }

    let docRef

    try {
        const storageRef = ref(storage, `images/recipes/${convertTitle(title)}`)
        const metadata = {
            contentType: file.mimetype
        }
        await uploadBytesResumable(storageRef, file.buffer, metadata)
        const downloadURL = await getDownloadURL(storageRef)

        docRef = await db.collection('recipes').add({ ...newRecipe, image: downloadURL })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }

    return res.status(200).json({ id: docRef.id, ...newRecipe })
}

const addFavourite = async (req, res) => {}

const removeFavourite = async (req, res) => {}

module.exports = { getRecipes, getUserRecipes, createRecipe, addFavourite, removeFavourite }
