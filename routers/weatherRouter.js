const express = require('express')
const router = express.Router()
const WeatherController = require('../controllers/weatherController')

router.get('/', WeatherController.getWeather)
router.post('/', WeatherController.createWeather)
router.post('/check-drift', WeatherController.checkSensorDrift)

module.exports = router
