import express from 'express'
import Creation from '../models/Creation.js'
import Template from '../models/Template.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

router.get('/public/:shareId', async (req, res) => {
  try {
    const creation = await Creation.findOne({ shareId: req.params.shareId }).populate('template')
    if (!creation) return res.status(404).json({ message: 'Creation not found' })
    res.json({ creation })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.use(authRequired)

router.get('/', async (req, res) => {
  try {
    const creations = await Creation.find({ user: req.userId })
      .populate('template', 'name slug category theme')
      .sort({ updatedAt: -1 })
    res.json({ creations })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { templateSlug, title, content, theme } = req.body
    if (!templateSlug || !title || !content) {
      return res.status(400).json({ message: 'templateSlug, title, and content are required' })
    }

    const template = await Template.findOne({ slug: templateSlug })
    if (!template) return res.status(404).json({ message: 'Template not found' })

    const creation = await Creation.create({
      user: req.userId,
      template: template._id,
      title,
      content,
      theme: theme || template.theme,
      category: template.category,
    })

    await creation.populate('template', 'name slug category theme')
    res.status(201).json({ creation })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, content, theme } = req.body
    const creation = await Creation.findOne({ _id: req.params.id, user: req.userId })
    if (!creation) return res.status(404).json({ message: 'Creation not found' })

    if (title) creation.title = title
    if (content) creation.content = content
    if (theme) creation.theme = theme
    await creation.save()
    await creation.populate('template', 'name slug category theme')

    res.json({ creation })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const creation = await Creation.findOneAndDelete({ _id: req.params.id, user: req.userId })
    if (!creation) return res.status(404).json({ message: 'Creation not found' })
    res.json({ message: 'Creation deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
