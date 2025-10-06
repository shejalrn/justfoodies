const prisma = require('./src/utils/db');
const { generateOrderNumber } = require('./src/utils/orderNumber');

async function createTestOrdersForUser2() {
  try {
    // Create address for user ID 2 (Test User)
    const address = await prisma.address.create({
      data: {
        userId: 2,
        label: 'Home',
        line1: '456 Test Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210'
      }
    });

    console.log('Created address:', address.id);

    // Get existing menu items
    const menuItems = await prisma.menuItem.findMany({
      take: 3
    });

    if (menuItems.length === 0) {
      console.log('No menu items found');
      return;
    }

    // Create test orders for user ID 2
    const order1 = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: 2,
        addressId: address.id,
        totalAmount: 570,
        paymentMethod: 'CASH',
        status: 'DELIVERED',
        items: {
          create: [
            {
              menuItemId: menuItems[0].id,
              title: menuItems[0].title,
              qty: 2,
              unitPrice: menuItems[0].price,
              totalPrice: menuItems[0].price * 2
            },
            {
              menuItemId: menuItems[1].id,
              title: menuItems[1].title,
              qty: 1,
              unitPrice: menuItems[1].price,
              totalPrice: menuItems[1].price
            }
          ]
        }
      }
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: 2,
        addressId: address.id,
        totalAmount: 320,
        paymentMethod: 'ONLINE',
        paymentStatus: 'PAID',
        status: 'PREPARING',
        items: {
          create: [
            {
              menuItemId: menuItems[2].id,
              title: menuItems[2].title,
              qty: 1,
              unitPrice: menuItems[2].price,
              totalPrice: menuItems[2].price
            }
          ]
        }
      }
    });

    console.log('Created test orders for user 2:', order1.orderNumber, order2.orderNumber);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrdersForUser2();