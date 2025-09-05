// Configuración de Express

const express = require("express");
const app = express();

app.use(express.json());

//rutas

const authRoutes = require("./routes/auth");
app.use("/api", userRoutes);

module.exports = app;