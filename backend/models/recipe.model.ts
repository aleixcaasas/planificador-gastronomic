import { Ingredient } from './ingredients.model'

export interface Recipe {
    id: string
    title: string
    description: string
    ingredients: Ingredient[]
    steps: string[]
    difficulty: string
    time: number
    image: string
    calories: number
    user_id: string
    origin_url: string
}
