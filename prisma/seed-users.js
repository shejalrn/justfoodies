const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user (upsert to handle existing data)
  const adminPassword = await bcrypt.hash('Justfood@2025', 10);
  await prisma.user.upsert({
    where: { email: 'admin@justfoodies.in' },
    update: {
      name: 'Admin',
      phone: '7038258837',
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
      name: 'Admin',
      phone: '7038258837',
      email: 'admin@justfoodies.in',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create test user (upsert to handle existing data)
  const userPassword = await bcrypt.hash('ranjeet123', 10);
  await prisma.user.upsert({
    where: { email: 'rajshejal22@gmail.com' },
    update: {
      name: 'Ranjeet Shejal',
      phone: '9175231409',
      password: userPassword,
      role: 'USER'
    },
    create: {
      name: 'Ranjeet Shejal',
      phone: '9175231409',
      email: 'rajshejal22@gmail.com',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log('Users updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });