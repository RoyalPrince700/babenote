import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['love-story', 'love-letter', 'love-message', 'marriage-proposal', 'i-miss-you'],
    },
    theme: { type: String, required: true, enum: ['dark', 'light'] },
    description: { type: String, required: true },
    previewAccent: { type: String, default: '#e8a0b4' },
    defaultContent: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Template', templateSchema)
