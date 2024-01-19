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
    const { user_id } = req.user
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

    res.status(200).json(recipes)
}

const getRecipe = async (req, res) => {
    const { parameter } = req.params

    try {
        let recipe

        if (!isNaN(parameter)) {
            const id = parseInt(parameter)
            // Si el parámetro es un número, busca por ID
            const docRef = await db.collection('recipes').doc(id.toString()).get()
            recipe = docRef.data()
        } else {
            // De lo contrario, asume que es un nombre de receta y busca por nombre
            const snapshot = await db.collection('recipes').get()
            const recipes = snapshot.docs.map((doc) => {
                const data = doc.data()
                return data
            })
            recipe = recipes.find((recipe) => {
                return recipe.urlTitle === parameter
            })
        }

        if (recipe) {
            res.json(recipe)
        } else {
            res.status(404).send('Receta no encontrada')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error al procesar la solicitud')
    }
}

const createRecipe = async (req, res) => {
    const { user_id } = req.user
    const { title, description, parsed_ingredients, difficulty, steps, time, meal } = req.body
    const newTime = time + ' min'

    const { file } = req
    const new_parsed_ingredients = JSON.parse(parsed_ingredients)
    const new_steps = steps.split('\n')
    const urlTitle = convertTitle(title)
    const newRecipe = {
        title,
        urlTitle,
        description,
        parsed_ingredients: new_parsed_ingredients,
        difficulty,
        steps: new_steps,
        time: newTime,
        user_id,
        meal
    }

    let docRef

    try {
        const storageRef = ref(storage, `images/recipes/${urlTitle}`)
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

module.exports = { getRecipes, getUserRecipes, getRecipe, createRecipe }
