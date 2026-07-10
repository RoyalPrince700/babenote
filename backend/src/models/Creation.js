import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const creationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    title: { type: String, required: true, trim: true },
    shareId: { type: String, unique: true, default: () => nanoid(10) },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    theme: { type: String, required: true, enum: ['dark', 'light'] },
    category: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Creation', creationSchema)
