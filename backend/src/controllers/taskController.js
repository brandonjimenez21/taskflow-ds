const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear tarea
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, startDate, dueDate, userId } = req.body;

    if (!title || !dueDate || !userId) {
      return res.status(400).json({ error: "title, dueDate y userId son obligatorios" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: new Date(dueDate),
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creando la tarea:", error);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // viene del middleware de autenticación

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    if (task.userId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta tarea" });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando la tarea:", error);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
};

module.exports = { createTask, deleteTask };
