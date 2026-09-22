import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center max-w-xl gap-8">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] tracking-tight uppercase">
          This space doesn&apos;t exist.
        </h1>
        <p className="text-muted-foreground tracking-widest font-light uppercase text-sm">
          The page you are looking for has been moved or no longer exists.
        </p>
        <div className="flex gap-8 mt-8 border-t border-border pt-8 w-full justify-center">
          <Link href="/" className="text-xs font-medium tracking-widest uppercase border-b border-transparent hover:border-foreground transition-colors">
            Return Home →
          </Link>
          <Link href="/collection" className="text-xs font-medium tracking-widest uppercase border-b border-transparent hover:border-foreground transition-colors">
            Explore Collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
