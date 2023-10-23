export interface User {
    id: string
    user_name: string
    full_name: string
    email: string
    password: string
    image: string
    shopping_list: ShoppingListItem[]
    weekly_plan: weeklyPlan
}

export interface ShoppingListItem {
    ingredient_id: string
    ingredient_name: string
    ingredient_image: string
}

export interface Meal {
    recipe_id: string
    recipe_title: string
    recipe_image: string
    recipe_time: number
}

export interface dailyPlan {
    breakfast: Meal[]
    lunch: Meal[]
    dinner: Meal[]
}

export interface weeklyPlan {
    monday: dailyPlan
    tuesday: dailyPlan
    wednesday: dailyPlan
    thursday: dailyPlan
    friday: dailyPlan
    saturday: dailyPlan
    sunday: dailyPlan
}
