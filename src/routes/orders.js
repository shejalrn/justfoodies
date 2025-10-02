const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/db');
const { authenticate } = require('../middleware/auth');
const { createOrder } = require('../services/orderService');

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
  body('paymentMethod').optional().isIn(['CASH', 'ONLINE', 'CARD'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, address, guestName, guestPhone, paymentMethod = 'CASH' } = req.body;
    const userId = req.user?.id;

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

    // Create or find address
    let addressId;
    if (userId) {
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
      // For guest orders, create address without user
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
    }

    const orderData = {
      userId,
      guestName: !userId ? guestName : null,
      guestPhone: !userId ? guestPhone : null,
      addressId,
      totalAmount,
      paymentMethod,
      items: orderItems
    };

    const order = await createOrder(orderData, req.io);
    res.status(201).json(order);

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
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

    if (!order) {
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
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;