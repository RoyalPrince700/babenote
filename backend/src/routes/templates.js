import express from 'express'
import Template from '../models/Template.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { category, theme } = req.query
    const filter = {}
    if (category) filter.category = category
    if (theme) filter.theme = theme

    const templates = await Template.find(filter).sort({ category: 1, theme: 1 })
    res.json({ templates })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const template = await Template.findOne({ slug: req.params.slug })
    if (!template) return res.status(404).json({ message: 'Template not found' })
    res.json({ template })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
