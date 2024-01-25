const axios = require('axios')
const { WeeklyPlan } = require('../models/user.model.js')
const baseUrl = 'http://localhost:3000/api'
const testCookie =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiS1dsT0xGNFdtcnJ2eTdldW1UZlciLCJpYXQiOjE3MDYyMDA4NDAsImV4cCI6MTcwODc5Mjg0MH0.79RFCNM-3xrI0YMH07YyEgEm8J4LoVZikJxw6X6Mg7k'

describe('delete-planning endpoint', () => {
    it("should reset the user's weekly plan", async () => {
        const response = await axios.delete(`${baseUrl}/delete-planning`, {
            headers: {
                Cookie: testCookie
            }
        })
        expect(response.status).toBe(200)
        const expectedWeeklyPlan = new WeeklyPlan().toFirestore()

        expect(response.data).toEqual(expectedWeeklyPlan)
    })
})

describe('planning endpoint', () => {
    it("should retrieve the user's weekly plan", async () => {
        const response = await axios.get(`${baseUrl}/planning`, {
            headers: {
                Cookie: testCookie
            }
        })
        expect(response.status).toBe(200)
        expect(typeof response.data).toBe('object')
    })
})

describe('add-meal endpoint', () => {
    it("should add a meal to the user's weekly plan", async () => {
        const newMeal = {
            day: 'monday',
            meal: 'breakfast',
            recipe_id: 'recipe1',
            recipe_title: 'Recipe 1',
            recipe_image: 'image_url',
            recipe_time: '30 min'
        }

        const response = await axios.post(`${baseUrl}/add-meal`, newMeal, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(response.data[newMeal.day][newMeal.meal]).toContainEqual(
            expect.objectContaining({
                recipe_id: newMeal.recipe_id,
                recipe_title: newMeal.recipe_title
            })
        )
    })
})

describe('delete-meal endpoint', () => {
    it("should remove a meal from the user's weekly plan", async () => {
        const mealToDelete = {
            day: 'monday',
            meal: 'breakfast',
            recipe_id: 'recipe1'
        }

        const response = await axios.post(`${baseUrl}/delete-meal`, mealToDelete, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(response.data[mealToDelete.day][mealToDelete.meal]).not.toContainEqual(
            expect.objectContaining({
                recipe_id: mealToDelete.recipe_id
            })
        )
    })
})
