import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center space-y-8">
      <h1 className="font-serif text-5xl md:text-7xl">
        {siteConfig.name}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        {siteConfig.description}
      </p>
      
      {/* 
        NOTE: This is just a placeholder foundation.
        Final UI, 3D showroom, and animations are NOT built in this phase.
      */}
      <div className="p-8 border border-border rounded-lg bg-card max-w-xl w-full mt-12">
        <h2 className="font-serif text-2xl mb-4">Project Foundation</h2>
        <ul className="text-left space-y-2 text-muted-foreground">
          <li>✓ Next.js App Router Setup</li>
          <li>✓ Tailwind CSS & Design Tokens</li>
          <li>✓ GSAP & Lenis hooks ready</li>
          <li>✓ Three.js directory architecture</li>
          <li>✓ SEO & Global Config setup</li>
        </ul>
      </div>
    </div>
  );
}
