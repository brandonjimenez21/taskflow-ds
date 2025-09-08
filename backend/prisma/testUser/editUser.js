// prisma/editUser.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'nuevo@example.com' }, // busca por email o id
    data: {
      name: 'Usuario Editado',
      role: 'admin',
    },
  });

  console.log('✏️ Usuario actualizado:', user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
