import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import Template from '../models/Template.js'
import { templateCatalog, templateDefaults } from './templateDefaults.js'

dotenv.config()

async function seedTemplates() {
  await connectDB()

  const templates = templateCatalog.flatMap(({ category, nameBase, description, previewAccent }) =>
    ['dark', 'light'].map((theme) => ({
      slug: `${category}-${theme}`,
      name: `${nameBase} (${theme === 'dark' ? 'Dark' : 'Light'})`,
      category,
      theme,
      description,
      previewAccent,
      defaultContent: templateDefaults[category],
    }))
  )

  for (const template of templates) {
    await Template.findOneAndUpdate({ slug: template.slug }, template, { upsert: true, new: true })
  }

  console.log(`Seeded ${templates.length} templates`)
  process.exit(0)
}

seedTemplates().catch((err) => {
  console.error(err)
  process.exit(1)
})
