import { mockPosts } from '../data/mockPosts'
import type { BlogPost } from '../types'

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return Promise.resolve(mockPosts)
}

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const post = mockPosts.find((item) => item.slug === slug)
  return Promise.resolve(post ?? null)
}
