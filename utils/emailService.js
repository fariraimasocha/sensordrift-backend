const nodemailer = require('nodemailer')

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

/**
 * Send email notification when sensor drift is detected
 * @param {Object} sensorData - Data from the sensor
 * @param {Object} apiData - Data from the API
 * @param {Object} differences - Calculated differences
 */
const sendSensorDriftAlert = async (sensorData, apiData, differences) => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: process.env.MAIL_RECEIVER, // You can change this to your target email
            subject: 'ALERT: Sensor Drift Detected',
            html: `
                <h2>Sensor Drift Alert</h2>
                <p>Significant differences detected between sensor readings and stored values</p>
                
                <h3>Sensor Data:</h3>
                <p>Temperature: ${sensorData.temperature}°C</p>
                <p>Humidity: ${sensorData.humidity}%</p>
                
                <h3>API Data:</h3>
                <p>Temperature: ${apiData.temperature}°C</p>
                <p>Humidity: ${apiData.humidity}%</p>
                
                <h3>Differences:</h3>
                <p>Temperature Difference: ${differences.tempDiff}°C</p>
                <p>Humidity Difference: ${differences.humidityDiff}%</p>
                
                <p>Please check your sensor calibration.</p>
            `,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent:', info.messageId)``
        return true
    } catch (error) {
        console.error('Error sending email:', error)
        return false
    }
}

module.exports = {
    sendSensorDriftAlert,
}
