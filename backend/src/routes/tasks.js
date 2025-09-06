const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");

// Crear tarea
router.post("/", async (req, res) => {
  const { title, description, status, priority, dueDate, userId } = req.body;

  if (!title || !dueDate || !userId) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
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

module.exports = router;