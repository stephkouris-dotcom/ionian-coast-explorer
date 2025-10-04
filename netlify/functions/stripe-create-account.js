import Stripe from 'stripe'
export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const { accountId, refresh_url, return_url } = JSON.parse(event.body || '{}')
    if (!accountId) return { statusCode: 400, body: 'Missing accountId' }
    const site = process.env.SITE_URL || 'https://example.com'
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refresh_url || `${site}/owners.html?state=refresh`,
      return_url: return_url || `${site}/owners.html?state=return`,
      type: 'account_onboarding',
    })
    return { statusCode: 200, body: JSON.stringify({ url: link.url }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
