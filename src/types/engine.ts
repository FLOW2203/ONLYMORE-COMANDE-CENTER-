export type Platform = 'linkedin' | 'facebook' | 'instagram' | 'google_business'
export type QueueStatus = 'queued' | 'publishing' | 'published' | 'failed' | 'cancelled'
export type RunStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'
export type WorkflowType = 'publish_linkedin' | 'publish_facebook' | 'generate_content' | 'fetch_reviews' | 'custom'
export type MerchantPlan = 'starter' | 'pro' | 'reputation_locale'
export type Sentiment = 'positive' | 'neutral' | 'negative'
export type Entity = 'ONLYMORE' | 'COLHYBRI' | 'CROWNIUM' | 'DOJUKU' | 'PLUMAYA'

export interface Merchant {
  id: string
  name: string
  business_type: string | null
  google_place_id: string | null
  linkedin_org_id: string | null
  facebook_page_id: string | null
  timezone: string
  plan: MerchantPlan
  config: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PublishQueueItem {
  id: string
  platform: Platform
  content: string
  media_urls: string[]
  scheduled_at: string
  published_at: string | null
  status: QueueStatus
  external_post_id: string | null
  merchant_id: string | null
  workflow_id: string | null
  error_message: string | null
  retry_count: number
  max_retries: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  merchants?: Merchant
}

export interface Workflow {
  id: string
  name: string
  description: string | null
  type: WorkflowType
  config: Record<string, unknown>
  is_active: boolean
  cron_schedule: string | null
  merchant_id: string | null
  created_at: string
  updated_at: string
}

export interface WorkflowRun {
  id: string
  workflow_id: string
  status: RunStatus
  started_at: string | null
  completed_at: string | null
  input_data: Record<string, unknown>
  output_data: Record<string, unknown>
  error_message: string | null
  duration_ms: number | null
  created_at: string
}

export interface GoogleReview {
  id: string
  merchant_id: string
  review_id: string
  author_name: string | null
  rating: number
  comment: string | null
  review_date: string | null
  reply_text: string | null
  reply_date: string | null
  ai_suggested_reply: string | null
  ai_reply_approved: boolean
  sentiment: Sentiment | null
  needs_attention: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  merchants?: Merchant
}
