class User {
    constructor(user_name, full_name, email, image) {
        this.user_name = user_name
        this.full_name = full_name
        this.email = email
        this.password
        this.image = image
        this.shopping_list
        this.weekly_plan
    }
}

class ShoppingListItem {
    constructor(ingredient_id, ingredient_name, ingredient_image) {
        this.ingredient_id = ingredient_id
        this.ingredient_name = ingredient_name
        this.ingredient_image = ingredient_image
    }
}

class Meal {
    constructor(recipe_id, recipe_title, recipe_image, recipe_time) {
        this.recipe_id = recipe_id
        this.recipe_title = recipe_title
        this.recipe_image = recipe_image
        this.recipe_time = recipe_time
    }
}

class DailyPlan {
    constructor(data) {
        this.breakfast = data.breakfast || {}
        this.lunch = data.lunch || {}
        this.dinner = data.dinner || {}
    }
}

export class WeeklyPlan {
    constructor(data) {
        this.monday = new DailyPlan(data.monday || {})
        this.tuesday = new DailyPlan(data.tuesday || {})
        this.wednesday = new DailyPlan(data.wednesday || {})
        this.thursday = new DailyPlan(data.thursday || {})
        this.friday = new DailyPlan(data.friday || {})
        this.saturday = new DailyPlan(data.saturday || {})
        this.sunday = new DailyPlan(data.sunday || {})
    }
}
