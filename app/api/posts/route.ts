import { fetchPosts } from '@/lib/notion'

export const revalidate = 300

export async function GET() {
  try {
    const posts = await fetchPosts()
    return Response.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts from Notion:', error)
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
