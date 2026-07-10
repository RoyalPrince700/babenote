import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export function authRequired(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export async function attachUser(req, res, next) {
  try {
    if (!req.userId) return next()
    req.user = await User.findById(req.userId).select('-password')
    next()
  } catch {
    next()
  }
}
