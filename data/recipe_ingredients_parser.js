const fs = require('fs')

async function addIngredientIds() {
    const recipes = await readJSONFile('data/recipes.json')
    const ingredients = await readJSONFile('data/ingredients.json')

    // Bucle para cada receta
    const newRecipes = recipes.map((recipe) => {
        // Bucle para cada ingrediente de la receta
        recipe.ingredients = recipe.ingredients.map((ingredient) => {
            const ingredientParts = ingredient.split(' ')
            const name = ingredientParts.join(' ')

            // Buscar el ingrediente en la lista de ingredientes
            const parsedIngredient = ingredientParts.forEach((element) => {
                const matchingIngredient = ingredients.find((i) => {
                    console.log(i.name.toLowerCase(), element.toLowerCase())
                    i.name.toLowerCase() == element.toLowerCase()
                })
                const id = matchingIngredient ? matchingIngredient.id : null
                if (id) {
                    return {
                        ingredient,
                        name,
                        id
                    }
                }
            })
            console.log(parsedIngredient)
            return {
                origin: ingredient,
                parsedIngredient
            }
        })

        return recipe
    })

    await writeJSONFile('data/recipes-with-ingredients.json', newRecipes)
}

async function readJSONFile(filePath) {
    const fileContents = await fs.promises.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
}

async function writeJSONFile(filePath, data) {
    const fileContents = JSON.stringify(data, null, 2)
    await fs.promises.writeFile(filePath, fileContents, 'utf8')
}

addIngredientIds()
