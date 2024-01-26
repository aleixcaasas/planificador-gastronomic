const planningController = require('../../controllers/planning.controller')
jest.mock('../../utils/firebase.js')
jest.mock('../../models/user.model.js', () => {
    return {
        WeeklyPlan: jest.fn().mockImplementation(() => ({
            toFirestore: jest.fn().mockReturnValue({
                monday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                },
                tuesday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                },
                wednesday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                },
                thursday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                },
                friday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                },
                saturday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                },
                sunday: {
                    breakfast: [],
                    lunch: [],
                    dinner: []
                }
            })
        }))
    }
})

jest.mock('../../utils/firebase.js', () => {
    return {
        db: {
            collection: jest.fn().mockReturnThis(),
            doc: jest.fn().mockReturnThis(),
            update: jest.fn().mockResolvedValue({}),
            get: jest.fn().mockResolvedValue({
                data: () => ({
                    /* datos simulados */
                })
            }),
            add: jest.fn().mockResolvedValue({ id: 'newDocumentId' })
        }
        // Mocks adicionales para getDownloadURL, ref, uploadBytesResumable, etc., si es necesario
    }
})

const { db } = require('../../utils/firebase.js')
const { WeeklyPlan } = require('../../models/user.model.js')

describe('getPlanning', () => {
    it('should return the weekly plan of the user', async () => {
        const userData = { weekly_plan: { monday: { breakfast: [] } } }
        db.collection()
            .doc()
            .get.mockResolvedValue({ data: () => userData })

        const req = { user: { user_id: 'userId' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await planningController.getPlanning(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.any(Object))
    })
})

describe('deletePlanning', () => {
    it('should reset the weekly plan of the user', async () => {
        db.collection().doc().update.mockResolvedValue({})

        const req = { user: { user_id: 'userId' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await planningController.deletePlanning(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(WeeklyPlan).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith(expect.any(Object))
    })
})

describe('addMeal', () => {
    it('should add a meal to the specified day and meal type', async () => {
        const user = {
            user_id: 'userId',
            weekly_plan: {
                monday: { breakfast: [], lunch: [], dinner: [] }
            }
        }

        db.collection()
            .doc()
            .get.mockResolvedValue({ data: () => user })

        const req = {
            user: { user_id: 'userId' },
            body: {
                day: 'monday',
                meal: 'breakfast',
                recipe_id: 'recipe1',
                recipe_title: 'Recipe 1',
                recipe_image: 'recipe_image_url',
                recipe_time: '30 mins'
            }
        }
        const res = {
            json: jest.fn()
        }

        await planningController.addMeal(req, res)

        expect(db.collection().doc().update).toHaveBeenCalledWith({
            weekly_plan: {
                monday: {
                    breakfast: [
                        {
                            recipe_id: 'recipe1',
                            recipe_title: 'Recipe 1',
                            recipe_image: 'recipe_image_url',
                            recipe_time: '30 mins'
                        }
                    ],
                    lunch: [],
                    dinner: []
                }
            }
        })
        expect(res.json).toHaveBeenCalledWith(expect.any(Object))
    })
})

describe('deleteMeal', () => {
    it('should remove a meal from the specified day and meal type', async () => {
        const user = {
            user_id: 'userId',
            weekly_plan: {
                monday: {
                    breakfast: [
                        { recipe_id: 'recipe1', recipe_title: 'Recipe 1' },
                        { recipe_id: 'recipe2', recipe_title: 'Recipe 2' }
                    ],
                    lunch: [],
                    dinner: []
                }
            }
        }

        db.collection()
            .doc()
            .get.mockResolvedValue({ data: () => user })

        const req = {
            user: { user_id: 'userId' },
            body: {
                day: 'monday',
                meal: 'breakfast',
                recipe_id: 'recipe1'
            }
        }
        const res = {
            json: jest.fn()
        }

        await planningController.deleteMeal(req, res)

        expect(db.collection().doc().update).toHaveBeenCalledWith({
            weekly_plan: {
                monday: {
                    breakfast: [{ recipe_id: 'recipe2', recipe_title: 'Recipe 2' }],
                    lunch: [],
                    dinner: []
                }
            }
        })
        expect(res.json).toHaveBeenCalledWith(expect.any(Object))
    })
})
