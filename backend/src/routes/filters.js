const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /filters -> guardar un filtro para el usuario
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Asegurarse de que userId existe y es número
    const userId = Number(req.user?.id); // si el token tiene id
    if (!userId) {
      return res.status(400).json({ error: "userId inválido" });
    }

    const { name, filters } = req.body;

    // Validar que filters sea un objeto
    if (!filters || typeof filters !== "object") {
      return res.status(400).json({ error: "Se requiere un objeto filters válido" });
    }

    // Crear el filtro
    const filter = await prisma.filter.create({
      data: {
        user: { connect: { id: userId } }, // conexión correcta con User
        name: name || null,
        filters, // JSON válido
      },
    });

    res.status(201).json(filter);
  } catch (error) {
    console.error("Error guardando filtro:", error);
    res.status(500).json({ error: "Error guardando el filtro" });
  }
});

// GET /filters -> obtener todos los filtros del usuario
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user?.id); // si el token tiene id
    if (!userId) {
      return res.status(400).json({ error: "userId inválido" });
    }

    const filters = await prisma.filter.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.json(filters);
  } catch (error) {
    console.error("Error obteniendo los filtros:", error);
    res.status(500).json({ error: "Error obteniendo los filtros" });
  }
});

module.exports = router;