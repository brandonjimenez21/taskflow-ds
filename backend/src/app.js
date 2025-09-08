const express = require("express");
const app = express();

app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando :D");
});

const authMiddleware = require("../src/middlewares/authMiddleware");

// Importar rutas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const departmentRoutes = require("./routes/department");
const statsRoutes = require("./routes/stats");
const statsExportRoutes = require("./routes/statsExport");

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/department", departmentRoutes);
app.use("/stats", authMiddleware, statsRoutes);
app.use("/stats/export", authMiddleware, statsExportRoutes);

module.exports = app;