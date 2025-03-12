const weatherModel = require('../models/weatherModel')

exports.getWeather = async (req, res) => {
    try {
        const weather = await weatherModel.find()
        res.status(200)
        res.json({
            success: true,
            data: weather,
        })
    } catch (err) {
        res.status(500)
        res.json({
            success: false,
            message: err.message,
        })
    }
}

exports.createWeather = async (req, res) => {
    try {
        const value = await weatherSchema(req.body)
        const weather = await weatherModel.create(value)
        res.status(201)
        res.json({
            success: true,
            data: weather,
        })
    } catch (err) {
        res.status(400)
        res.json({
            success: false,
            message: err.message,
        })
    }
}
