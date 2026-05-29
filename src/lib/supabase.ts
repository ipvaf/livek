import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Livek] Missing Supabase env vars — check Vercel environment variables')
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
)

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string
          handle: string
          display_name: string
          platform: 'instagram' | 'tiktok'
          followers: number
          country: string
          flag: string
          country_name: string
          category: string
          is_verified: boolean
          is_live: boolean
          viewers: number | null
          avatar_url: string | null
          rating: number
          review_count: number
          status: 'pending' | 'approved' | 'rejected'
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          handle: string
          display_name: string
          platform: 'instagram' | 'tiktok'
          followers?: number
          country?: string
          flag?: string
          country_name?: string
          category?: string
          is_verified?: boolean
          is_live?: boolean
          viewers?: number | null
          avatar_url?: string | null
          rating?: number
          review_count?: number
          status?: 'pending' | 'approved' | 'rejected'
          user_id?: string | null
          created_at?: string
        }
        Update: {
          handle?: string
          display_name?: string
          followers?: number
          is_live?: boolean
          viewers?: number | null
          avatar_url?: string | null
          rating?: number
          review_count?: number
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
      creator_submissions: {
        Row: {
          id: string
          handle: string
          platform: 'instagram' | 'tiktok'
          profile_url: string | null
          category: string
          country: string
          followers: number | null
          email: string
          message: string | null
          status: 'pending' | 'approved' | 'rejected'
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          handle: string
          platform: 'instagram' | 'tiktok'
          profile_url?: string | null
          category: string
          country: string
          followers?: number | null
          email: string
          message?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          user_id?: string | null
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          name_ar: string
          icon: string
          slug: string
          count: number
          color: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          icon: string
          slug: string
          count?: number
          color?: string
        }
        Update: {
          name?: string
          name_ar?: string
          icon?: string
          slug?: string
          count?: number
          color?: string
        }
      }
    }
  }
}
