export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ProjectStatus  = 'draft' | 'eliciting' | 'reviewing' | 'paying' | 'generating' | 'complete' | 'failed'
export type PaymentProvider = 'razorpay' | 'stripe'
export type PaymentStatus  = 'pending' | 'paid' | 'failed'
export type ComplexityLevel = 'Simple' | 'Medium' | 'Complex'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:                  string
          full_name:           string | null
          job_role:            string | null
          industry:            string | null
          is_admin:            boolean
          notification_prefs:  Json | null
          suspended:           boolean
          created_at:          string
        }
        Insert: {
          id:                  string
          full_name?:          string | null
          job_role?:           string | null
          industry?:           string | null
          is_admin?:           boolean
          notification_prefs?: Json | null
          suspended?:          boolean
          created_at?:         string
        }
        Update: {
          full_name?:          string | null
          job_role?:           string | null
          industry?:           string | null
          is_admin?:           boolean
          notification_prefs?: Json | null
          suspended?:          boolean
        }
        Relationships: []
      }
      projects: {
        Row: {
          id:                   string
          user_id:              string
          idea_text:            string
          industry:             string | null
          tech_preference:      string | null
          status:               ProjectStatus
          complexity:           ComplexityLevel | null
          estimated_cost_inr:   number | null
          review_feedback:      string | null
          payment_provider:     PaymentProvider | null
          payment_id:           string | null
          payment_status:       PaymentStatus
          created_at:           string
          updated_at:           string
        }
        Insert: {
          id:                   string
          user_id:              string
          idea_text:            string
          industry?:            string | null
          tech_preference?:     string | null
          status?:              ProjectStatus
          complexity?:          ComplexityLevel | null
          estimated_cost_inr?:  number | null
          review_feedback?:     string | null
          payment_provider?:    PaymentProvider | null
          payment_id?:          string | null
          payment_status?:      PaymentStatus
        }
        Update: {
          status?:              ProjectStatus
          complexity?:          ComplexityLevel | null
          estimated_cost_inr?:  number | null
          review_feedback?:     string | null
          payment_provider?:    PaymentProvider | null
          payment_id?:          string | null
          payment_status?:      PaymentStatus
          updated_at?:          string
        }
        Relationships: []
      }
      qa_responses: {
        Row: {
          id:          string
          project_id:  string
          question:    string
          answer:      string | null
          skipped:     boolean
          order_index: number
          created_at:  string
        }
        Insert: {
          id?:         string
          project_id:  string
          question:    string
          answer?:     string | null
          skipped?:    boolean
          order_index: number
        }
        Update: {
          answer?:     string | null
          skipped?:    boolean
        }
        Relationships: []
      }
      documents: {
        Row: {
          id:           string
          project_id:   string
          doc_type:     string
          content:      string
          generated_at: string
        }
        Insert: {
          id?:          string
          project_id:   string
          doc_type:     string
          content:      string
        }
        Update: {
          content?: string
        }
        Relationships: []
      }
      pricing_config: {
        Row: {
          id:                string
          usd_inr_rate:      number
          platform_fee_inr:  number
          gst_rate:          number
          buffer_multiplier: number
          updated_at:        string
        }
        Insert: {
          id?:               string
          usd_inr_rate:      number
          platform_fee_inr:  number
          gst_rate:          number
          buffer_multiplier: number
        }
        Update: {
          usd_inr_rate?:      number
          platform_fee_inr?:  number
          gst_rate?:          number
          buffer_multiplier?: number
          updated_at?:        string
        }
        Relationships: []
      }
      agent_skills: {
        Row: {
          id:         string
          agent:      string
          content:    string
          version:    number
          updated_at: string
        }
        Insert: {
          id?:        string
          agent:      string
          content:    string
          version?:   number
          updated_at?: string
        }
        Update: {
          content?:   string
          version?:   number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_stats: {
        Args: Record<string, never>
        Returns: {
          total_projects: number
          complete_projects: number
          total_revenue: number
          conversion_rate: number
        }
      }
      admin_get_daily_chart: {
        Args: { p_days: number }
        Returns: { day: string; count: number }[]
      }
      admin_get_recent_projects: {
        Args: { p_limit: number }
        Returns: {
          id: string
          idea_snippet: string
          full_name: string
          status: string
          revenue: number
          created_at: string
        }[]
      }
      admin_get_industry_breakdown: {
        Args: Record<string, never>
        Returns: { industry: string; count: number }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
