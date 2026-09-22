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
