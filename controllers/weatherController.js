const weatherModel = require('../models/weatherModel')
const emailService = require('../utils/emailService')

// Define thresholds for sensor drift detection
const TEMP_THRESHOLD = 3.0
const HUMIDITY_THRESHOLD = 10.0

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

// New endpoint for sensor drift detection
exports.checkSensorDrift = async (req, res) => {
    try {
        // Get sensor data from request body
        const { temperature, humidity } = req.body

        if (!temperature || !humidity) {
            return res.status(400).json({
                success: false,
                message: 'Temperature and humidity are required',
                resetRequired: false,
            })
        }

        // Convert to numbers if they're strings
        const sensorTemp = parseFloat(temperature)
        const sensorHumidity = parseFloat(humidity)

        // Get the latest weather data from DB
        const latestWeather = await weatherModel
            .findOne()
            .sort({ createdAt: -1 })

        if (!latestWeather) {
            // If no data exists, create first entry
            const newWeather = await weatherModel.create({
                temperature: sensorTemp.toString(),
                humidity: sensorHumidity.toString(),
            })

            return res.status(200).json({
                success: true,
                message: 'First sensor reading recorded',
                data: newWeather,
                resetRequired: false,
            })
        }

        // Convert API data to numbers
        const apiTemp = parseFloat(latestWeather.temperature)
        const apiHumidity = parseFloat(latestWeather.humidity)

        // Calculate differences
        const tempDiff = Math.abs(sensorTemp - apiTemp)
        const humidityDiff = Math.abs(sensorHumidity - apiHumidity)

        // Check if differences exceed thresholds
        const resetRequired =
            tempDiff > TEMP_THRESHOLD || humidityDiff > HUMIDITY_THRESHOLD

        // Prepare response data
        const responseData = {
            success: true,
            sensorData: {
                temperature: sensorTemp,
                humidity: sensorHumidity,
            },
            apiData: {
                temperature: apiTemp,
                humidity: apiHumidity,
            },
            differences: {
                tempDiff,
                humidityDiff,
            },
            thresholds: {
                temperature: TEMP_THRESHOLD,
                humidity: HUMIDITY_THRESHOLD,
            },
            resetRequired,
        }

        // If reset is required, send email notification
        if (resetRequired) {
            await emailService.sendSensorDriftAlert(
                responseData.sensorData,
                responseData.apiData,
                responseData.differences
            )

            responseData.message =
                'Significant drift detected! Email notification sent.'
        } else {
            responseData.message = 'Sensor readings within acceptable range.'
        }

        res.status(200).json(responseData)
    } catch (err) {
        console.error('Sensor drift check error:', err)
        res.status(500).json({
            success: false,
            message: err.message,
            resetRequired: false,
        })
    }
}
