const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Crear un departamento si no existe
  const department = await prisma.department.upsert({
    where: { name: 'IT' },
    update: {},
    create: { name: 'IT' },
  });

  // Crear un usuario si no existe
  const passwordHash = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { email: 'juan@example.com' },
    update: {},
    create: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: passwordHash,
      role: 'user',
      departmentId: department.id,
    },
  });
}

main()
  .then(() => {
    console.log('Seed ejecutado con éxito 🚀');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
