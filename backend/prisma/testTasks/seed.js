// prisma/testTasks/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Primero nos aseguramos que hay un usuario
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Usuario Test',
          email: 'usuario@test.com',
          password: 'hashed_password', // si se quiere se puede usar bcrypt puedes hacerlo
          role: 'USER',
          department: {
            create: { name: 'Test Department' }
          }
        },
      });
    }

    // Creamos algunas tareas con distintos estados
    await prisma.task.createMany({
      data: [
        { title: "Tarea pendiente 1", status: "TODO", dueDate: new Date(), userId: user.id },
        { title: "Tarea pendiente 2", status: "TODO", dueDate: new Date(), userId: user.id },
        { title: "Tarea en progreso", status: "IN_PROGRESS", dueDate: new Date(), userId: user.id },
        { title: "Tarea completada 1", status: "DONE", dueDate: new Date(), userId: user.id },
        { title: "Tarea completada 2", status: "DONE", dueDate: new Date(), userId: user.id },
        { title: "Tarea completada 3", status: "DONE", dueDate: new Date(), userId: user.id },
      ],
    });


    console.log('Datos de prueba creados con éxito');
}

main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });