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
