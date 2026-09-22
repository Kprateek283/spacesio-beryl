export const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: import('sanity').Rule) => Rule.required() },
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
