const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')

const weatherRouter = require('./routers/weatherRouter')

const app = express()

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to database')
    })
    .catch((err) => {
        console.log(err)
    })

app.use('/api/weather', weatherRouter)

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})
