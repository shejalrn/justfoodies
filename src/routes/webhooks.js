const express = require('express');
const crypto = require('crypto');
const prisma = require('../utils/db');

const router = express.Router();

// Sanity webhook for content updates
router.post('/sanity', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['sanity-webhook-signature'];
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (secret && signature) {
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');

      if (signature !== computedSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const payload = JSON.parse(req.body.toString());
    console.log('Sanity webhook received:', payload);

    // Handle different document types
    if (payload._type === 'menuItem') {
      // Sync menu item changes from Sanity
      // This would typically update local cache or trigger revalidation
      console.log('Menu item updated in Sanity:', payload.title);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;