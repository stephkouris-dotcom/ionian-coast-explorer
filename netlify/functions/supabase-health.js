import { createClient } from '@supabase/supabase-js'
export async function handler() {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE)
    const { error } = await supabase.from('listings').select('id', { head: true, count: 'exact' })
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) }
  }
}
