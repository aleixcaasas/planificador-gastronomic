import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).send({ title: 'Hello World' })
})

app.listen(3000, () => {
    console.log('Server listening at port 3000')
})
