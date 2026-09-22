export const faq = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'answer', title: 'Answer', type: 'text', validation: (Rule: import('sanity').Rule) => Rule.required() },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'order', title: 'Order', type: 'number', initialValue: 0 }
  ]
};
