// prisma/deleteUser.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.delete({
    where: { email: 'nuevo@example.com' }, // cambia al email o id que quieras
  });

  console.log('🗑️ Usuario eliminado:', user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
