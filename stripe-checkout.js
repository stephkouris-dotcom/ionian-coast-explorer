import Stripe from 'stripe'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const data = JSON.parse(event.body || '{}')
    const amount = Number(data.priceCents || 0)
    if (!data.connectedAccountId || amount <= 0) {
      return { statusCode: 400, body: 'Missing connectedAccountId or priceCents' }
    }
    const site = process.env.SITE_URL || 'https://example.com'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: (data.currency || 'eur'),
          product_data: { name: data.title || 'Booking' },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: data.successUrl || `${site}/test-pay.html?paid=1`,
      cancel_url: data.cancelUrl || `${site}/test-pay.html?canceled=1`,
      payment_intent_data: {
        transfer_data: { destination: data.connectedAccountId },
      },
    })
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
