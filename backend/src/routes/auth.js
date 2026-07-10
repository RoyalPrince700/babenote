import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
