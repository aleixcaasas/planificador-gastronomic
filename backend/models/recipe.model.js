const Ingredient = require('./ingredients.model')

class Recipe {
    constructor(id, title, description, ingredients, steps, difficulty, time, image, calories, user_id, origin_url) {
        this.id = id
        this.title = title
        this.description = description
        this.ingredients = ingredients
        this.steps = steps
        this.difficulty = difficulty
        this.time = time
        this.image = image
        this.calories = calories
        this.user_id = user_id
        this.origin_url = origin_url
    }
}

module.exports = { Recipe }
