const NewsletterModel = require('../models/newsletterModel')
const { newsletterSchema } = require('../middlewares/validator')

exports.getNewsletters = async (req, res) => {
    try {
        const newsletters = await NewsletterModel.find()
        res.status(200)
        res.json({
            success: true,
            data: newsletters,
        })
    } catch (err) {
        res.status(500)
        res.json({
            success: false,
            message: err.message,
        })
    }
}

exports.getNewsletter = async (req, res) => {
    try {
        const newsletter = await NewsletterModel.findById(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: newsletter,
        })
    } catch (err) {
        res.status(500)
        res.json({
            success: false,
            message: err.message,
        })
    }
}

exports.createNewsletter = async (req, res) => {
    try {
        const value = await newsletterSchema.validateAsync(req.body)
        const newsletter = await NewsletterModel.create(value)
        res.status(201)
        res.json({
            success: true,
            data: newsletter,
        })
    } catch (err) {
        res.status(400)
        res.json({
            success: false,
            message: err.message,
        })
    }
}

exports.updateNewsletter = async (req, res) => {
    try {
        const value = await newsletterSchema.validateAsync(req.body)
        const newsletter = await NewsletterModel.findByIdAndUpdate(
            req.params.id,
            value,
            {
                new: true,
                runValidators: true,
            }
        )
        res.status(200)
        res.json({
            success: true,
            data: newsletter,
        })
    } catch (err) {
        res.status(400)
        res.json({
            success: false,
            message: err.message,
        })
    }
}

exports.deleteNewsletter = async (req, res) => {
    try {
        await NewsletterModel.findByIdAndDelete(req.params.id)
        res.status(204)
        res.json({
            success: true,
            data: null,
        })
    } catch (err) {
        res.status(500)
        res.json({
            success: false,
            message: err.message,
        })
    }
}
