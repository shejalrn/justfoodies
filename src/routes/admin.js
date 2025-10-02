const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../utils/db');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { updateOrderStatus, ORDER_STATUSES } = require('../services/orderService');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      todayRevenue,
      popularItems
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: ORDER_STATUSES.PENDING } }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          status: { not: ORDER_STATUSES.CANCELLED }
        },
        _sum: { totalAmount: true }
      }),
      prisma.orderItem.groupBy({
        by: ['menuItemId', 'title'],
        _sum: { qty: true },
        orderBy: { _sum: { qty: 'desc' } },
        take: 5
      })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      popularItems
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get contact queries
router.get('/contacts', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status })
    };

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.contact.count({ where })
    ]);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update contact status
router.patch('/contacts/:id/status', [
  body('status').isIn(['NEW', 'READ', 'REPLIED', 'CLOSED']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status }
    });

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

// Get all users
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          addresses: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all orders with filters
router.get('/orders', [
  query('status').optional().isIn(Object.values(ORDER_STATUSES)),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('date').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, page = 1, limit = 20, date } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(date && {
        createdAt: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        }
      })
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
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
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
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

// Update order status
router.patch('/orders/:id/status', [
  body('status').isIn(Object.values(ORDER_STATUSES)).withMessage('Invalid status'),
  body('note').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, note } = req.body;
    const orderId = parseInt(req.params.id);

    const order = await updateOrderStatus(orderId, status, note, req.io);
    res.json(order);

  } catch (error) {
    if (error.message.includes('Cannot change status')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get single order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
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

// Menu management
router.get('/menu/items', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      include: {
        category: true,
        _count: {
          select: { orderItems: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Toggle menu item availability
router.patch('/menu/items/:id/availability', [
  body('isAvailable').isBoolean().withMessage('isAvailable must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await prisma.menuItem.update({
      where: { id: parseInt(req.params.id) },
      data: { isAvailable: req.body.isAvailable },
      include: { category: true }
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item availability' });
  }
});

module.exports = router;