const { mongoose } = require('mongoose')

const weatherSchema = new mongoose.Schema(
    {
        temperature: {
            type: String,
            required: [true, 'Title is required'],
        },
        humidity: {
            type: String,
            required: [true, 'Description is required'],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Weather', weatherSchema)
