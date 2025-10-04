// netlify/functions/stripe-account-link.js
import Stripe from 'stripe';

export const handler = async (event) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { accountId } = JSON.parse(event.body);

    if (!accountId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing accountId' })
      };
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.SITE_URL}/owners.html`,
      return_url: `${process.env.SITE_URL}/owners.html?connected=true`,
      type: 'account_onboarding'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: accountLink.url })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
