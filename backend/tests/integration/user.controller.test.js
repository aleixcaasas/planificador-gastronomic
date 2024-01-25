const axios = require('axios')
const baseUrl = 'http://localhost:3000/api'
const testCookie =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiS1dsT0xGNFdtcnJ2eTdldW1UZlciLCJpYXQiOjE3MDYyMDA4NDAsImV4cCI6MTcwODc5Mjg0MH0.79RFCNM-3xrI0YMH07YyEgEm8J4LoVZikJxw6X6Mg7k'
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

describe('user endpoint', () => {
    it("should retrieve the user's information", async () => {
        const response = await axios.get(`${baseUrl}/user`, {
            headers: { Cookie: testCookie }
        })

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('name')
        expect(response.data).toHaveProperty('email')
    })
})

describe('updateUser endpoint', () => {
    it("should update the user's information with an image", async () => {
        const formData = new FormData()
        formData.append('full_name', 'Updated Full Name')
        formData.append('user_name', 'UpdatedUserName')
        formData.append('image', fs.createReadStream(path.join(__dirname, 'test-image.png')))

        const response = await axios.patch(`${baseUrl}/update-user`, formData, {
            headers: {
                ...formData.getHeaders(),
                Cookie: testCookie
            }
        })

        expect(response.status).toBe(200)
        expect(response.data.updated).toBe(true)
    })
})
