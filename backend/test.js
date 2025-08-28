const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Usuarios en BD:", users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
