import Stripe from 'stripe'
export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const { email } = JSON.parse(event.body || '{}')
    if (!email) return { statusCode: 400, body: 'Missing email' }
    const account = await stripe.accounts.create({ type: 'express', email })
    return { statusCode: 200, body: JSON.stringify({ accountId: account.id }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
