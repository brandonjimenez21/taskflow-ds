const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateToken, verifyToken } = require("../services/tokenService");

// requireManager
function requireManager(req, res, next) {
  if (req.user && req.user.role === "Manager") {
    return next();
  }
  return res.status(403).json({ error: "Acceso restringido a managers" });
}


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

// Eliminar tarea (lógico)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });
    res.json({ message: "Tarea eliminada lógicamente", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando la tarea" });
  }
});

// Listar tareas
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, orderBy } = req.query;

    // Construir orden seguro
    let order = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(" ");
      const allowedFields = ["dueDate", "priority"];
      const allowedDirections = ["asc", "desc"];
      if (
        field && direction &&
        allowedFields.includes(field) &&
        allowedDirections.includes(direction.toLowerCase())
      ) {
        order = { [field]: direction.toLowerCase() };
      } else {
        return res.status(400).json({ error: "Parámetro orderBy inválido" });
      }
    }

    // Construir filtro de búsqueda, incluyendo deleted: false
    let where = { deleted: false }; // solo tareas activas
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: order,
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo las tareas" });
  }
});


router.post("/test-token", (req, res) => {
  const {userId} = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId es requerido" });
  }
  const token = generateToken({ userId });
  res.json({ token });
});

router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token es requerido" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  res.json({ message: "Token válido", decoded });
});

router.get("/stats", authMiddleware, requireManager, async (req, res) => {
  try {
    const totalTasks = await prisma.task.count();
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const tasksByPriority = await prisma.task.groupBy({
      by: ['priority'],
      _count: { priority: true },
    });
    res.json({ totalTasks, tasksByStatus, tasksByPriority });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
});

router.get("/user/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  // Validación de permisos
  if (req.user.role !== 'Manager' && req.user.userId !== Number(userId)) {
    return res.status(403).json({ error: "Usuario no apto a ver estas tareas" });
  }

  try {
    // Obtener filtros y orderBy del query
    const { status, priority, dueDateFrom, dueDateTo, orderBy } = req.query;

    // Construir filtros
    const filters = { userId: Number(userId) };
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (dueDateFrom || dueDateTo) {
      filters.dueDate = {};
      if (dueDateFrom) filters.dueDate.gte = new Date(dueDateFrom);
      if (dueDateTo) filters.dueDate.lte = new Date(dueDateTo);
    }

    // Construir orden seguro
    let order = undefined;
    if (orderBy) {
      const [field, direction] = orderBy.split(" ");
      const allowedFields = ["dueDate", "priority"]; // campos permitidos
      const allowedDirections = ["asc", "desc"];

      if (
        field && direction &&
        allowedFields.includes(field) &&
        allowedDirections.includes(direction.toLowerCase())
      ) {
        order = { [field]: direction.toLowerCase() };
      } else {
        return res.status(400).json({ error: "Parámetro orderBy inválido" });
      }
    }

    // Obtener tareas con filtros y orden
    const tasks = await prisma.task.findMany({
      where: filters,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: order,
    });

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo las tareas del usuario" });
  }
});

module.exports = router;
