const prisma = require('../utils/db');
const { generateOrderNumber } = require('../utils/orderNumber');
const { emitOrderUpdate, emitNewOrder } = require('./socketService');

const ORDER_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY_FOR_DISPATCH: 'READY_FOR_DISPATCH',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

const STATUS_FLOW = {
  PENDING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_DISPATCH', 'CANCELLED'],
  READY_FOR_DISPATCH: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

const createOrder = async (orderData, io) => {
  const orderNumber = generateOrderNumber();
  
  const order = await prisma.order.create({
    data: {
      orderNumber,
      ...orderData,
      items: {
        create: orderData.items
      },
      statusLogs: {
        create: {
          status: ORDER_STATUSES.PENDING,
          note: 'Order placed'
        }
      }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      },
      address: true,
      user: true,
      statusLogs: true
    }
  });

  emitNewOrder(io, order);
  return order;
};

const updateOrderStatus = async (orderId, newStatus, note, io) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, orderNumber: true }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const allowedStatuses = STATUS_FLOW[order.status] || [];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Cannot change status from ${order.status} to ${newStatus}`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      statusLogs: {
        create: {
          status: newStatus,
          note
        }
      }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      },
      address: true,
      user: true,
      statusLogs: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  emitOrderUpdate(io, order.orderNumber, updatedOrder);
  return updatedOrder;
};

module.exports = {
  ORDER_STATUSES,
  STATUS_FLOW,
  createOrder,
  updateOrderStatus
};