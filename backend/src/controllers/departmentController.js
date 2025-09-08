// src/controllers/departmentController.js
const prisma = require("../services/prisma");

// Obtener tareas por departamento
const getTasksByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.query; // recibimos el id por query param

    if (!departmentId) {
      return res.status(400).json({ error: "departmentId es requerido" });
    }

    const tasks = await prisma.task.findMany({
      where: {
        user: {
          departmentId: Number(departmentId),
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error obteniendo tareas por departamento:", error);
    return res.status(500).json({ error: "Error al obtener las tareas" });
  }
};

module.exports = { getTasksByDepartment };