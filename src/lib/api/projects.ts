import { cache } from "react";
import { Project } from "@/data/projects";
import { mockProjects } from "@/data/projects";
import { client } from "@/sanity/lib/client";
import { getProjectsQuery, getProjectBySlugQuery } from "@/sanity/lib/queries";

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo1234') {
      const data = await client.fetch(getProjectsQuery);
      if (data && data.length > 0) return data;
    }
  } catch {
    console.error("Sanity fetch failed, falling back to local mock data.");
  }
  return mockProjects;
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'demo1234') {
      const data = await client.fetch(getProjectBySlugQuery, { slug });
      if (data) return data;
    }
  } catch {
    console.error("Sanity fetch failed, falling back to local mock data.");
  }
  return mockProjects.find(p => p.slug === slug) || null;
});

export async function getAdjacentProjects(currentSlug: string): Promise<{ prev: Project | null, next: Project | null }> {
  const allProjects = await getProjects();
  const index = allProjects.findIndex((p: Project) => p.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };
  
  const prev = index > 0 ? allProjects[index - 1] : null;
  const next = index < allProjects.length - 1 ? allProjects[index + 1] : null;
  
  return { prev, next };
}
