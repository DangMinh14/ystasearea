import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://awjtlvsankqemozhsojh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3anRsdnNhbmtxZW1vemhzb2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODA1MzMsImV4cCI6MjA4NTE1NjUzM30.0eP4jpFMKAgGhHEZwNKWsS5nXfWdxRLs1Mc89EGGams'

export const supabase = createClient(supabaseUrl, supabaseKey)