const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const authMiddleware = require("../middlewares/authMiddleware");

// Crear tarea
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.body.id; // Asegúrate de obtener el userId del cuerpo de la solicitud o del token

  if (!title || !dueDate || !userId) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (req.user.role !== 'admin' && req.user.userId !== userId) {
    return res.status(403).json({ error: "Usuario no apto a crear tarea" });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
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

router.post("/edit", authMiddleware, async (req, res) => {
  const { id, title, description, status, priority, dueDate } = req.body;  

  if (!id || !title || !dueDate) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(400).json({ error: "Usuario no apto a modificar tarea" });
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

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user.userId !== userId) {
    return res.status(403).json({ error: "Usuario no apto a eliminar tarea" });
  }

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

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json(tasks);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo las tareas" });
  }
});

module.exports = router;