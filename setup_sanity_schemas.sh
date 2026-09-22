#!/bin/bash
mkdir -p src/sanity/schemas

cat << 'INNER_EOF' > src/sanity/schemas/seo.ts
export const seo = {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    { name: 'metaTitle', title: 'Meta Title', type: 'string' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text' },
    { name: 'ogImage', title: 'Open Graph Image', type: 'image' },
    { name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/category.ts
export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image' }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/product.ts
export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule: any) => Rule.required() },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'subcategory', title: 'Subcategory', type: 'string' },
    { name: 'shortDescription', title: 'Short Description', type: 'text' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image' }] },
    { 
      name: 'specifications', 
      title: 'Specifications', 
      type: 'array', 
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'value', type: 'string' }] }]
    },
    {
      name: 'finishes',
      title: 'Finishes',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'color', type: 'string' }, { name: 'image', type: 'image' }] }]
    },
    { name: 'applications', title: 'Applications', type: 'array', of: [{ type: 'string' }] },
    { name: 'materials', title: 'Materials', type: 'array', of: [{ type: 'reference', to: [{ type: 'material' }] }] },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'brochure', title: 'Brochure PDF', type: 'file' },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'relatedProducts', title: 'Related Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'seo', title: 'SEO', type: 'seo' }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/project.ts
export const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: any) => Rule.required() },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'year', title: 'Completion Year', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'materialsUsed', title: 'Materials Used', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'seo', title: 'SEO', type: 'seo' }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/solution.ts
export const solution = {
  name: 'solution',
  title: 'Solution',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: any) => Rule.required() },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    { name: 'content', title: 'Content', type: 'text' },
    { name: 'recommendedProducts', title: 'Recommended Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }] },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'seo', title: 'SEO', type: 'seo' }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/material.ts
export const material = {
  name: 'material',
  title: 'Material (3D Future)',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'type', title: 'Type', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Base Image', type: 'image' },
    { name: 'textureImage', title: 'Texture/Diffuse Map', type: 'image' },
    { name: 'normalMap', title: 'Normal Map', type: 'image' },
    { name: 'roughnessMap', title: 'Roughness Map', type: 'image' },
    { name: 'relatedProducts', title: 'Related Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/brand.ts
export const brand = {
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'website', title: 'Website URL', type: 'url' },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/faq.ts
export const faq = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'text' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'order', title: 'Order', type: 'number' }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schemas/siteSettings.ts
export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'companyName', title: 'Company Name', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'address', title: 'Address', type: 'text' },
    { 
      name: 'socialLinks', 
      title: 'Social Links', 
      type: 'array', 
      of: [{ type: 'object', fields: [{ name: 'platform', type: 'string' }, { name: 'url', type: 'url' }] }]
    },
    { name: 'footerText', title: 'Footer Text', type: 'text' },
    { name: 'defaultSEO', title: 'Default SEO', type: 'seo' }
  ]
};
INNER_EOF

cat << 'INNER_EOF' > src/sanity/schema.ts
import { type SchemaTypeDefinition } from 'sanity'
import { seo } from './schemas/seo'
import { category } from './schemas/category'
import { product } from './schemas/product'
import { project } from './schemas/project'
import { solution } from './schemas/solution'
import { material } from './schemas/material'
import { brand } from './schemas/brand'
import { faq } from './schemas/faq'
import { siteSettings } from './schemas/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [seo, category, product, project, solution, material, brand, faq, siteSettings],
}
INNER_EOF

chmod +x setup_sanity_schemas.sh
./setup_sanity_schemas.sh
