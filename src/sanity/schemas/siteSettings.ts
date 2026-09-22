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
