import { getProjectBySlug, getAdjacentProjects } from "@/lib/api/projects";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectMaterials } from "@/components/projects/ProjectMaterials";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  return {
    title: project ? `${project.title} | Spacesio Beryl` : "Project Not Found",
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(params.slug);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Hero Text */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center gap-8 mx-auto">
          <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-muted-foreground font-medium">
            <span>{project.location}</span>
            <span>&middot;</span>
            <span>{project.category}</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] tracking-tight uppercase">
            {project.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden mb-24 rounded-sm">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Info & Materials */}
        <div className="flex flex-col gap-16 mb-24">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 font-light tracking-wide leading-relaxed">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide leading-relaxed text-foreground/90 mb-8">
              {project.description}
            </h2>
            <div className="mt-8 p-4 bg-muted/50 border border-border text-xs text-muted-foreground inline-block">
              NOTE: Demo Content. This is not an actual Spacesio Beryl project.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border pt-16">
            <div className="flex flex-col gap-6 text-sm tracking-widest uppercase text-foreground/80">
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Location</span>
                <span>{project.location}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Category</span>
                <span>{project.category}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Year</span>
                <span>{project.completionYear}</span>
              </div>
            </div>

            <ProjectMaterials materialSlugs={project.materials} />
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-24">
          <ProjectGallery images={project.gallery} />
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-32">
          <Link 
            href={`/contact?type=consultation&source=project-page&projectSlug=${project.slug}&projectName=${encodeURIComponent(project.title)}`}
            className="bg-foreground text-background px-12 py-5 text-sm font-medium tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Start a Similar Project →
          </Link>
        </div>

        {/* Navigation */}
        <div className="border-t border-border pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="group flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-muted-foreground">Previous Project</span>
              <span className="font-serif text-2xl group-hover:text-accent transition-colors">{prev.title}</span>
            </Link>
          ) : <div />}
          
          <Link href="/projects" className="text-xs font-medium tracking-widest uppercase border-b border-foreground hover:text-accent hover:border-accent transition-colors">
            View All Projects →
          </Link>

          {next ? (
            <Link href={`/projects/${next.slug}`} className="group flex flex-col gap-2 text-right">
              <span className="text-xs tracking-widest uppercase text-muted-foreground">Next Project</span>
              <span className="font-serif text-2xl group-hover:text-accent transition-colors">{next.title}</span>
            </Link>
          ) : <div />}
        </div>

      </div>
    </div>
  );
}
