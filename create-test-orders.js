const prisma = require('./src/utils/db');
const { generateOrderNumber } = require('./src/utils/orderNumber');

async function createTestOrders() {
  try {
    // Create address for user ID 3 (Ranjeet)
    const address = await prisma.address.create({
      data: {
        userId: 3,
        label: 'Home',
        line1: '123 Test Street',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411047',
        phone: '9175231409'
      }
    });

    console.log('Created address:', address.id);

    // Create or get menu items first
    let menuItem1 = await prisma.menuItem.findFirst({ where: { title: 'Butter Chicken' } });
    if (!menuItem1) {
      menuItem1 = await prisma.menuItem.create({
        data: {
          title: 'Butter Chicken',
          description: 'Delicious butter chicken',
          price: 250,
          isVeg: false
        }
      });
    }

    let menuItem2 = await prisma.menuItem.findFirst({ where: { title: 'Naan' } });
    if (!menuItem2) {
      menuItem2 = await prisma.menuItem.create({
        data: {
          title: 'Naan',
          description: 'Fresh naan bread',
          price: 100,
          isVeg: true
        }
      });
    }

    let menuItem3 = await prisma.menuItem.findFirst({ where: { title: 'Biryani' } });
    if (!menuItem3) {
      menuItem3 = await prisma.menuItem.create({
        data: {
          title: 'Biryani',
          description: 'Aromatic biryani',
          price: 320,
          isVeg: false
        }
      });
    }

    // Create test orders
    const order1 = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: 3,
        addressId: address.id,
        totalAmount: 450,
        paymentMethod: 'CASH',
        status: 'DELIVERED',
        items: {
          create: [
            {
              menuItemId: menuItem1.id,
              title: 'Butter Chicken',
              qty: 1,
              unitPrice: 250,
              totalPrice: 250
            },
            {
              menuItemId: menuItem2.id,
              title: 'Naan',
              qty: 2,
              unitPrice: 100,
              totalPrice: 200
            }
          ]
        }
      }
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: 3,
        addressId: address.id,
        totalAmount: 320,
        paymentMethod: 'ONLINE',
        paymentStatus: 'PAID',
        status: 'PREPARING',
        items: {
          create: [
            {
              menuItemId: menuItem3.id,
              title: 'Biryani',
              qty: 1,
              unitPrice: 320,
              totalPrice: 320
            }
          ]
        }
      }
    });

    console.log('Created test orders:', order1.orderNumber, order2.orderNumber);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrders();