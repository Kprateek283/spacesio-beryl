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
