const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Honorarium amount in cents — change this to update the price
const HONORARIUM_AMOUNT = 15000; // $150.00

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: HONORARIUM_AMOUNT,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: 'Al Maqam Al Mahmoud — Honorarium',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      amount: HONORARIUM_AMOUNT,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
