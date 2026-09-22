export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'subcategory', title: 'Subcategory', type: 'string' },
    { name: 'shortDescription', title: 'Short Description', type: 'text' },
    { name: 'description', title: 'Description', type: 'text', validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image' }],
      validation: (Rule: import('sanity').Rule) => Rule.required().min(1).error('Add at least one product photo — without it the product falls back to an unrelated stock image on the site.')
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', validation: (Rule: import('sanity').Rule) => Rule.required() },
          { name: 'value', type: 'string', validation: (Rule: import('sanity').Rule) => Rule.required() }
        ]
      }]
    },
    {
      name: 'finishes',
      title: 'Finishes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', validation: (Rule: import('sanity').Rule) => Rule.required() },
          { name: 'colorHex', title: 'Color', type: 'string' },
          { name: 'image', type: 'image' }
        ]
      }]
    },
    { name: 'applications', title: 'Applications', type: 'array', of: [{ type: 'string' }] },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
  ]
};
