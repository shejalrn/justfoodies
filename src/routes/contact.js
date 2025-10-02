const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/db');

const router = express.Router();

// Submit contact form
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array().map(err => err.msg).join(', '),
        errors: errors.array() 
      });
    }

    const { name, email, phone, subject, message } = req.body;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message
      }
    });

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      id: contact.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;