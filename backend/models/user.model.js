class User {
    constructor(user_name, full_name, email, password, image) {
        this.user_name = user_name
        this.full_name = full_name
        this.email = email
        this.password = password
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
    constructor(breakfast, lunch, dinner) {
        this.breakfast = new Meal()
        this.lunch = new Meal()
        this.dinner = new Meal()
    }
}

class WeeklyPlan {
    constructor() {
        this.monday = new DailyPlan()
        this.tuesday = new DailyPlan()
        this.wednesday = new DailyPlan()
        this.thursday = new DailyPlan()
        this.friday = new DailyPlan()
        this.saturday = new DailyPlan()
        this.sunday = new DailyPlan()
    }
}

module.exports = { User, ShoppingListItem, Meal, DailyPlan, WeeklyPlan }
