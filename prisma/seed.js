const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const thaliCategory = await prisma.category.create({
    data: { name: 'Thali', slug: 'thali', position: 1 }
  });

  const biryaniCategory = await prisma.category.create({
    data: { name: 'Biryani', slug: 'biryani', position: 2 }
  });

  const pgPackCategory = await prisma.category.create({
    data: { name: 'PG Packs', slug: 'pg-packs', position: 3 }
  });

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        sku: 'VEG-THALI-001',
        title: 'Veg Thali',
        description: 'Paneer Makhani, Mix Veg, Dal Tadka, Jeera Rice, Chapati, Salad & Pickle, Papad, Gulab Jamun',
        categoryId: thaliCategory.id,
        price: 250,
        isVeg: true,
        isAvailable: true
      },
      {
        sku: 'NON-VEG-THALI-001',
        title: 'Non-Veg Thali',
        description: 'Chicken Masala, Jeera Rice, Chapati, Salad, Gulab Jamun',
        categoryId: thaliCategory.id,
        price: 350,
        isVeg: false,
        isAvailable: true
      },
      {
        sku: 'VEG-BIRYANI-001',
        title: 'Veg Biryani',
        description: 'Aromatic basmati rice cooked with mixed vegetables and spices',
        categoryId: biryaniCategory.id,
        price: 250,
        isVeg: true,
        isAvailable: true
      },
      {
        sku: 'CHICKEN-BIRYANI-001',
        title: 'Chicken Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken and spices',
        categoryId: biryaniCategory.id,
        price: 350,
        isVeg: false,
        isAvailable: true
      },
      {
        sku: 'PG-PACK-70',
        title: 'PG Pack - Rs 70',
        description: '2 chapati + rice + dal + sabzi + salad + papad + pickle',
        categoryId: pgPackCategory.id,
        price: 70,
        isVeg: true,
        isAvailable: true
      },
      {
        sku: 'PG-PACK-120',
        title: 'Regular Pack - Rs 120',
        description: '3 paratha/chapatis + jeera rice + dal + 2 sabzis + papad + sweet',
        categoryId: pgPackCategory.id,
        price: 120,
        isVeg: true,
        isAvailable: true
      }
    ]
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      phone: '9999999999',
      email: 'admin@justfoodie.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  // Create sample coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minOrderAmount: 200,
        expiry: new Date('2024-12-31'),
        usageLimit: 100,
        active: true
      },
      {
        code: 'FLAT50',
        type: 'FIXED',
        value: 50,
        minOrderAmount: 300,
        expiry: new Date('2024-12-31'),
        usageLimit: 50,
        active: true
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });