import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Payment API is working!' });
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_LHnBCG8o7BUqz2',
  key_secret: 'JxyO4z31Tswuz983XdhlW7gA',
});

// Create order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    console.log('Creating order with amount:', amount, 'currency:', currency);
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    console.log('Order created successfully:', order.id);
    res.json({ orderId: order.id });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order', details: err });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', 'JxyO4z31Tswuz983XdhlW7gA')
      .update(text)
      .digest('hex');

    if (signature === razorpay_signature) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment details',
    });
  }
});

export default router; 