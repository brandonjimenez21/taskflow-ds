// src/routes/department.js
const express = require("express");
const router = express.Router();
const { getTasksByDepartment } = require("../controllers/departmentController");
const authMiddleware = require("../middlewares/authMiddleware");

// GET /department/tasks?departmentId=1
router.get("/tasks", authMiddleware, getTasksByDepartment);

module.exports = router;