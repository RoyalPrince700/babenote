import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import templateRoutes from './routes/templates.js'
import creationRoutes from './routes/creations.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Babe Love API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/creations', creationRoutes)

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
