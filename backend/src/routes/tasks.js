const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const authMiddleware = require("../middlewares/authMiddleware");

// Crear tarea
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.user.userId; // tomar el userId del token, no del body

  // Validar campos obligatorios
  if (!title || !dueDate) {
    return res.status(400).json({ error: "El título y la fecha límite son obligatorios" });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "pendiente",
        priority: priority || "media",
        dueDate: new Date(dueDate),
        userId
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando la tarea" });
  }
});

// Editar tarea
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const { id } = req.params;

  // Validar campos obligatorios
  if (!title || !dueDate) {
    return res.status(400).json({ error: "El título y la fecha límite son obligatorios" });
  }

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status, priority, dueDate: new Date(dueDate) },
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando la tarea" });
  }
});

// Eliminar tarea
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Tarea eliminada", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando la tarea" });
  }
});

// Listar tareas
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo las tareas" });
  }
});

module.exports = router;
