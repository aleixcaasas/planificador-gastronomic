export default class User {
    constructor(id, user_name, full_name, email, password, image, shopping_list, weekly_plan) {
        this.id = id
        this.user_name = user_name
        this.full_name = full_name
        this.email = email
        this.password = password
        this.image = image
        this.shopping_list = shopping_list
        this.weekly_plan = weekly_plan
    }
}

export class ShoppingListItem {
    constructor(ingredient_id, ingredient_name, ingredient_image) {
        this.ingredient_id = ingredient_id
        this.ingredient_name = ingredient_name
        this.ingredient_image = ingredient_image
    }
}

export class Meal {
    constructor(recipe_id, recipe_title, recipe_image, recipe_time) {
        this.recipe_id = recipe_id
        this.recipe_title = recipe_title
        this.recipe_image = recipe_image
        this.recipe_time = recipe_time
    }
}

export class DailyPlan {
    constructor(breakfast, lunch, dinner) {
        this.breakfast = breakfast
        this.lunch = lunch
        this.dinner = dinner
    }
}

export class WeeklyPlan {
    constructor(monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
        this.monday = monday
        this.tuesday = tuesday
        this.wednesday = wednesday
        this.thursday = thursday
        this.friday = friday
        this.saturday = saturday
        this.sunday = sunday
    }
}
