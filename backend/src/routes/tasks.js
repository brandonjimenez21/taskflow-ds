const express = require("express");
const router = express.Router();
const { createTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

// Crear tarea
router.post("/", createTask);

// Eliminar tarea
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;