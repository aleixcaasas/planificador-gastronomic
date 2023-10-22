const fs = require('fs')

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

readJSONFile('uniqueRecipes.json', (recipes) => {
    // Agregar un ID a cada receta
    const newData = recipes.map((recipe, index) => ({
        id: index + 1,
        ...recipe
    }))

    readJSONFile('titles.json', (titles) => {
        newData.forEach((recipe) => {
            const title = titles.find((title) => title.title === recipe.title)
            if (title) {
                recipe.image = title.image
            }
        })

        const newDataJSON = JSON.stringify(newData, null, 2)
        fs.writeFile('./data/recipes.json', newDataJSON, 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON de títulos:', err)
            } else {
                console.log('Títulos guardados en new_recipes.json')
            }
        })
    })
})
