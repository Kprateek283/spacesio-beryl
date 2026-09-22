import { groq } from 'next-sanity'

// Array-valued fields resolve to `null` (not `[]`) in GROQ when empty on the
// source document, but the frontend always expects an array to `.map()`/
// index into — every array field below is wrapped in `coalesce(..., [])`.
export const getProductsQuery = groq`
  *[_type == "product"] {
    "id": _id,
    name,
    "slug": slug.current,
    "category": category->slug.current,
    subcategory,
    shortDescription,
    description,
    "heroImage": heroImage.asset->url,
    "images": coalesce(gallery[].asset->url, []),
    "specifications": coalesce(specifications, []),
    "finishes": coalesce(finishes[]{ "id": _key, name, colorHex, "image": image.asset->url }, []),
    "applications": coalesce(applications, []),
    "tags": coalesce(tags, []),
    featured
  }
`

export const getProductBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    "category": category->slug.current,
    subcategory,
    shortDescription,
    description,
    "heroImage": heroImage.asset->url,
    "images": coalesce(gallery[].asset->url, []),
    "specifications": coalesce(specifications, []),
    "finishes": coalesce(finishes[]{ "id": _key, name, colorHex, "image": image.asset->url }, []),
    "applications": coalesce(applications, []),
    "tags": coalesce(tags, []),
    featured
  }
`

export const getCategoriesQuery = groq`
  *[_type == "category"] {
    "id": _id,
    name,
    "slug": slug.current,
    description,
    "image": image.asset->url
  }
`

export const getProjectsQuery = groq`
  *[_type == "project"] {
    "id": _id,
    title,
    "slug": slug.current,
    location,
    category,
    "completionYear": year,
    description,
    "heroImage": heroImage.asset->url,
    "gallery": coalesce(gallery[].asset->url, []),
    "materials": coalesce(materialsUsed[]->slug.current, []),
    featured
  }
`

export const getProjectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    location,
    category,
    "completionYear": year,
    description,
    "heroImage": heroImage.asset->url,
    "gallery": coalesce(gallery[].asset->url, []),
    "materials": coalesce(materialsUsed[]->slug.current, []),
    featured
  }
`

export const getFaqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    "id": _id,
    question,
    answer,
    category,
    order
  }
`
