const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const jwt = require("jsonwebtoken");

// Middleware para verificar el token y obtener el usuario autenticado
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // aquí estará userId y role
    next();
  });
}

// GET /stats/user
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Contar las tareas agrupadas por estado
    const tasksByStatus = await prisma.task.groupBy({
      by: ["status"],
      where: { assignedToId: userId },
      _count: { status: true },
    });

    // Transformar el resultado en un objeto plano
    const stats = tasksByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

module.exports = router;