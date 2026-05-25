import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
        }
      }
      auctions: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          starting_price: number
          current_bid: number
          reserve_price: number
          end_time: string
          seller_id: string
          status: 'active' | 'ending_soon' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          starting_price: number
          current_bid: number
          reserve_price: number
          end_time: string
          seller_id: string
          status?: 'active' | 'ending_soon' | 'completed'
          created_at?: string
        }
        Update: {
          title?: string
          description?: string
          current_bid?: number
          status?: 'active' | 'ending_soon' | 'completed'
        }
      }
      bids: {
        Row: {
          id: string
          auction_id: string
          bidder_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          auction_id: string
          bidder_id: string
          amount: number
          created_at?: string
        }
        Update: never
      }
      categories: {
        Row: {
          id: string
          name: string
          name_ar: string
          icon: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          icon: string
          slug: string
        }
        Update: {
          name?: string
          name_ar?: string
          icon?: string
          slug?: string
        }
      }
    }
  }
}
