const express = require('express');
const router = express.Router();

const Stripe = require('stripe')('sk_test_51O3PYjIcpnrfUv1SqZkzFjfsWglDMjo1NwKHDEgF9v6JH4xc8Qy8Z7rd2TxqAIUdbNDCU2d1Vt3qfAyTkCvr3ZWX00qbLwhUke');

router.post('/', async (req, res) => { console.log(req.body)
    let status, error;
    const { token, amount } = req.body;
    console.log(token);
    console.log(amount);
    try {
      await Stripe.charges.create({
        source: token.id,
        amount,
        currency: 'usd',
      });
      status = 'success';
    } catch (error) {
      console.log(error);
      status = 'Failure';
    }
    res.json({ error, status });
  });

module.exports = router;

