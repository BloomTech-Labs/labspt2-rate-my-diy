require('dotenv').config()
const Stripe = require('stripe');

const stripe = Stripe(process.env.S_SECRET_KEY); // stripe secret

module.exports = {
  stripe
};
