const { title } = require("process");
const prisma = require("./prisma");

// Funciones relacionadas con las tareas
async function createTask(data) {
  return await prisma.task.create({ data: { tittle } });
}

async function updateTask(id, data) {
  return await prisma.task.update({
    where: { id },
    data: { title, description, status, priority, dueDate } = data,
  });
}

async function deleteTask(id) {
  return await prisma.task.delete({ where: { id } });
}

module.exports = { createTask, updateTask };