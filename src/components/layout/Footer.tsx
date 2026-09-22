import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { CurrentYear } from "@/components/ui/current-year";

export function Footer() {
  return (
    <footer className="w-full relative z-20 mt-12">
      {/* Horizontal Separator */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      
      <div className="bg-[#050505] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
            
            {/* Logo and About */}
            <div className="md:col-span-5 pr-0 md:pr-12">
              <Link href="/" className="inline-block mb-6">
                <Image 
                  src="/assets/icons/logo.png" 
                  alt="Spacesio" 
                  width={160} 
                  height={50} 
                  className="object-contain transition-transform duration-300 hover:scale-105"
                  style={{
                    filter: "drop-shadow(1px 1px 0px rgba(255,255,255,0.8)) drop-shadow(-1px -1px 0px rgba(255,255,255,0.8)) drop-shadow(1px -1px 0px rgba(255,255,255,0.8)) drop-shadow(-1px 1px 0px rgba(255,255,255,0.8))"
                  }}
                />
              </Link>
              <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-8">
                {siteConfig.description} We bring unparalleled craftsmanship and innovative materials to luxury architectural spaces.
              </p>
              
              {/* TODO: point these at real Instagram/LinkedIn profiles before launch */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Collection</h4>
              <ul className="space-y-4 text-sm text-neutral-400 font-medium">
                <li><Link href="/collection/flooring" className="hover:text-white transition-colors">Flooring</Link></li>
                <li><Link href="/collection/wall" className="hover:text-white transition-colors">Wall Coverings</Link></li>
                <li><Link href="/collection/window" className="hover:text-white transition-colors">Window Treatments</Link></li>
                <li><Link href="/collection" className="hover:text-white transition-colors">View All</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-neutral-400 font-medium">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/studio" className="hover:text-white transition-colors">Studio</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Newsletter</h4>
              <p className="text-sm text-neutral-400 mb-4">Stay updated with our latest architectural releases and editorial insights.</p>
              <form className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-full px-5 py-3 outline-none focus:border-neutral-500 transition-colors"
                />
                <button type="button" aria-label="Subscribe to newsletter" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </form>
            </div>
            
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium uppercase tracking-widest">
            <p>© <CurrentYear /> {siteConfig.name}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
