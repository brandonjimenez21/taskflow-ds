// prisma/createUser.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      password: hashedPassword,
      role: 'user',
      departmentId: 1, // asegúrate de que ese departamento exista
    },
  });

  console.log('✅ Usuario creado:', user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
