const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixMenuData() {
  // Fix Non-Veg Thali isVeg flag
  await prisma.menuItem.updateMany({
    where: {
      title: 'Non-Veg Thali'
    },
    data: {
      isVeg: false
    }
  });

  // Fix any other non-veg items that might be incorrectly marked as veg
  await prisma.menuItem.updateMany({
    where: {
      OR: [
        { title: { contains: 'Non-Veg' } },
        { title: { contains: 'Chicken' } },
        { title: { contains: 'Mutton' } },
        { title: { contains: 'Fish' } }
      ]
    },
    data: {
      isVeg: false
    }
  });

  console.log('Menu data fixed successfully!');
}

fixMenuData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());