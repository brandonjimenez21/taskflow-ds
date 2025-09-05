const express = require("express");
const app = express();

app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando :D");
});

// Importar rutas
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

module.exports = app;