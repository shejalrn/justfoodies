const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/db');
const { authenticate } = require('../middleware/auth');
const { createOrder } = require('../services/orderService');
const { createOrder: createRazorpayOrder, verifyPayment } = require('../services/razorpayService');

const router = express.Router();

// Create order (guest or authenticated)
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('items.*.id').notEmpty().withMessage('Item ID required'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('address.line1').notEmpty().withMessage('Address line 1 is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.pincode').notEmpty().withMessage('Pincode is required'),
  body('address.phone').isMobilePhone('en-IN').withMessage('Valid phone number required'),
  body('guestName').optional().isString(),
  body('guestPhone').optional().isMobilePhone('en-IN'),
  body('paymentMethod').optional()
], async (req, res) => {
  try {
    console.log('=== ORDER CREATION DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, address, guestName, guestPhone } = req.body;
    const paymentMethod = 'ONLINE'; // Force online payment only
    const userId = req.user?.id;
    
    console.log('Order creation - Payment method:', paymentMethod);
    console.log('Order creation - User ID:', userId);
    console.log('Order creation - Items:', items?.length);
    console.log('Order creation - Address:', address);

    let totalAmount = 0;
    const orderItems = [];

    // Create or find menu items in database
    for (const item of items) {
      let dbMenuItem = await prisma.menuItem.findFirst({
        where: { sku: item.id }
      });
      
      if (!dbMenuItem) {
        // Create new menu item in database
        dbMenuItem = await prisma.menuItem.create({
          data: {
            sku: item.id,
            title: item.title,
            description: item.title,
            price: item.price,
            isVeg: item.isVeg || true,
            isAvailable: true
          }
        });
      }
      
      const itemTotal = item.price * item.qty;
      totalAmount += itemTotal;
      
      orderItems.push({
        menuItemId: dbMenuItem.id,
        title: item.title,
        qty: item.qty,
        unitPrice: item.price,
        totalPrice: itemTotal,
        addons: item.addons || null
      });
    }

    // Create address
    let addressId;
    let finalUserId = userId;
    
    if (userId) {
      // Authenticated user - create address for them
      const createdAddress = await prisma.address.create({
        data: {
          userId,
          label: address.label || 'Home',
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone
        }
      });
      addressId = createdAddress.id;
    } else {
      // Guest order - create guest user and address
      const guestUser = await prisma.user.findFirst({ where: { phone: 'guest' } }) || 
        await prisma.user.create({ data: { name: 'Guest', phone: 'guest', role: 'GUEST' } });
      
      const createdAddress = await prisma.address.create({
        data: {
          userId: guestUser.id,
          label: 'Guest Address',
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone
        }
      });
      addressId = createdAddress.id;
      finalUserId = null; // Keep as null for guest orders
    }

    const orderData = {
      userId: finalUserId,
      guestName: !finalUserId ? guestName : null,
      guestPhone: !finalUserId ? guestPhone : null,
      addressId,
      totalAmount,
      paymentMethod,
      items: orderItems
    };
    
    console.log('Final order data:', { originalUserId: userId, finalUserId, hasUser: !!finalUserId, orderData });

    const order = await createOrder(orderData, req.io);
    console.log('Order created:', order.orderNumber, 'Payment method:', order.paymentMethod);
    res.status(201).json(order);

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Test Razorpay endpoint
router.get('/test-razorpay', async (req, res) => {
  try {
    console.log('Testing Razorpay with credentials:', {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET'
    });
    
    const razorpayOrder = await createRazorpayOrder(100, 'INR', 'TEST123');
    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.error('Razorpay test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to list all orders
router.get('/debug/all', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        guestName: true,
        totalAmount: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json({ orders, count: orders.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug user orders endpoint
router.get('/debug/user-orders', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        guestName: true,
        totalAmount: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    });
    
    res.json({
      user,
      userOrders,
      userOrdersCount: userOrders.length,
      allOrders,
      allOrdersCount: allOrders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    console.log('Looking for order:', req.params.orderNumber);
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        address: true,
        user: {
          select: { id: true, name: true, phone: true, email: true }
        },
        statusLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    console.log('Order found:', !!order);
    if (!order) {
      console.log('Order not found in database');
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get user orders (authenticated)
router.get('/user/orders', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    console.log('Fetching orders for user ID:', req.user.id);
    console.log('User object:', req.user);

    // First check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, phone: true }
    });
    
    if (!userExists) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', userExists);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          address: true,
          statusLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.order.count({ where: { userId: req.user.id } })
    ]);

    console.log('Found orders:', orders.length, 'Total:', total);
    console.log('Orders data:', orders.map(o => ({ id: o.id, orderNumber: o.orderNumber, userId: o.userId, status: o.status })));
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Create Razorpay order
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, orderNumber } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log('Razorpay not configured - missing credentials');
      return res.status(503).json({ 
        error: 'Payment service unavailable',
        message: 'Razorpay credentials not configured'
      });
    }
    
    console.log('Creating Razorpay order for:', { amount, orderNumber });
    
    const razorpayOrder = await createRazorpayOrder(amount, 'INR', orderNumber);
    console.log('Razorpay order created successfully:', razorpayOrder);
    
    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      details: error.message 
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = req.body;
    
    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    
    if (isValid) {
      await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: 'PAID',
          paymentMethod: 'ONLINE',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        }
      });
      
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Test endpoint to verify auth
router.get('/test-auth', authenticate, async (req, res) => {
  res.json({ 
    message: 'Auth working', 
    user: req.user,
    userId: req.user.id 
  });
});



module.exports = router;