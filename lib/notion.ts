import { Client } from '@notionhq/client'
import { Post } from '@/types/post'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function fetchPosts(): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    sorts: [{ property: 'Date Publication', direction: 'ascending' }],
    page_size: 100,
  })
  return response.results.map(mapNotionPageToPost)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotionPageToPost(page: any): Post {
  const p = page.properties
  return {
    id: page.id,
    titre: p['Titre du Post']?.title?.[0]?.plain_text ?? '',
    datePublication: p['Date Publication']?.date?.start ?? null,
    statut: p['Statut']?.select?.name ?? 'Idée',
    marque: p['Marque']?.select?.name ?? '',
    plateformes: p['Plateforme']?.multi_select?.map((s: { name: string }) => s.name) ?? [],
    typeContenu: p['Type de Contenu']?.select?.name ?? '',
    pilier: p['Pilier de Contenu']?.select?.name ?? '',
    agent: p['Agent Responsable']?.select?.name ?? '',
    captionFR: p['Caption FR']?.rich_text?.[0]?.plain_text ?? '',
    captionEN: p['Caption EN']?.rich_text?.[0]?.plain_text ?? '',
    hashtags: p['Hashtags']?.rich_text?.[0]?.plain_text ?? '',
    lienCanva: p['Lien Canva']?.url ?? null,
    publie: p['Publié']?.checkbox ?? false,
    engagement: p['Engagement']?.number ?? 0,
  }
}
