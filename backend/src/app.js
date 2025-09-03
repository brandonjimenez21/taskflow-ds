// Configuración de Express

const express = require("express");
const app = express();

app.use(express.json());

//rutas

const userRouter = require("./routes/users");
app.user("/api/users", userRoutes);

module.exports = app;