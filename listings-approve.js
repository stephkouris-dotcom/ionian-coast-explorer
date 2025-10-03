import { createClient } from '@supabase/supabase-js'
export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const { listingId, action } = JSON.parse(event.body || '{}')
    if (!listingId || !['approve','reject'].includes(action)) {
      return { statusCode: 400, body: 'Invalid payload' }
    }
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE)
    const status = action === 'approve' ? 'approved' : 'rejected'
    const { error } = await supabase.from('listings').update({ status }).eq('id', listingId)
    if (error) throw error
    return { statusCode: 200, body: JSON.stringify({ ok: true, status }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) }
  }
}
