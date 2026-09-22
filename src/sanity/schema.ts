import { type SchemaTypeDefinition } from 'sanity'
import { seo } from './schemas/seo'
import { category } from './schemas/category'
import { product } from './schemas/product'
import { project } from './schemas/project'
import { material } from './schemas/material'
import { brand } from './schemas/brand'
import { faq } from './schemas/faq'
import { siteSettings } from './schemas/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [seo, category, product, project, material, brand, faq, siteSettings],
}
