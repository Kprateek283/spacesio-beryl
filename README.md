# Spacesio Beryl

Premium architectural flooring, wall, window, and exterior surface solutions.

## Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animation**: GSAP, Lenis
- **3D**: Three.js, React Three Fiber, drei
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Architecture

- `/src/app`: Next.js App Router pages and layouts
- `/src/components`: React components (UI, layout, sections, 3D)
- `/src/data`: Mock data and static content
- `/src/hooks`: Custom React hooks (Lenis, GSAP, etc.)
- `/src/lib`: Utilities and configuration
- `/src/three`: Three.js specific code (materials, scenes, loaders)
- `/src/types`: TypeScript definitions
- `/public/assets`: Static assets (images, models, textures)

## Future Roadmap

1. UI implementation
2. Collection
3. Product pages
4. CMS Integration (Sanity)
5. 3D showroom
6. Visualizer
7. Performance optimization
8. Production deployment
