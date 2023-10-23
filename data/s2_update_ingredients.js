const { match } = require('assert')
const fs = require('fs')
const { get } = require('http')

function readJSONFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error al leer el archivo JSON (${filename}):`, err)
        } else {
            try {
                const jsonData = JSON.parse(data)
                callback(jsonData)
            } catch (error) {
                console.error(`Error al analizar el archivo JSON (${filename}):`, error)
            }
        }
    })
}

// GET NAMES FROM ALL INGREDIENTS
function getNamesFromIngredients() {
    readJSONFile('data/ingredients.json', (ingredients) => {
        // Agregar un ID a cada receta
        const newData = ingredients.map((ingredient, index) => ingredient.name)

        const newDataJSON = JSON.stringify(newData, null, 2)
        fs.writeFile('./ingredient_names.json', newDataJSON, 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON de títulos:', err)
            } else {
                console.log('Títulos guardados en new_recipes.json')
            }
        })
    })
}

// RESOTRE NEW INGREDIENTS FROM NAMES
function restoreNewIngredients() {
    readJSONFile('data/ingredient_names.json', (ingredient_names) => {
        const new_ingredients = ingredient_names.sort().map((ingr, index) => ({
            id: index + 1,
            name: ingr
        }))

        readJSONFile('data/ingredients.json', (ingredients) => {
            const newIngredientsWithId = new_ingredients.map((ingredient) => {
                const matchedIngredient = ingredients.find((ingr) => ingr.name === ingredient.name)
                if (matchedIngredient) {
                    return {
                        id: ingredient.id,
                        ...matchedIngredient
                    }
                }
            })

            const newDataJSON = JSON.stringify(newIngredientsWithId, null, 2)
            fs.writeFile('./data/new_ingredients.json', newDataJSON, 'utf8', (err) => {
                if (err) {
                    console.error('Error al guardar el archivo JSON de ingredientes:', err)
                } else {
                    console.log('Ingredientes guardados en new_ingredients.json')
                }
            })
        })
    })
}

// REINDEX NEW INGREDIENTS
function reindexNewIngredients() {
    readJSONFile('data/new_ingredients.json', (ingredients) => {
        console.log(ingredients.length)
        const newIngredientsWithId = ingredients.map((ingredient, index) => ({
            id: index + 1,
            name: ingredient.name,
            image: ingredient.image,
            quantity: ingredient.quantity,
            calories: ingredient.calories
        }))

        const newDataJSON = JSON.stringify(newIngredientsWithId, null, 2)
        fs.writeFile('./data/new_ingredients2.json', newDataJSON, 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON de ingredientes:', err)
            } else {
                console.log('Ingredientes guardados en new_ingredients.json')
            }
        })
    })
}
