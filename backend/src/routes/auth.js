const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { login } = require("../services/authService");
const { refreshToken } = require("../controllers/authController");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  try {
    const result = await login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
});

// Registrar nuevo usuario
router.post("/register", async (req, res) => {
  const { name, email, password, role, departmentId } = req.body;

  try {
    if (!name || !email || !password || !departmentId) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está en uso" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, departmentId },
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respuesta segura
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout exitoso" });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Contraseña reseteada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
});

// Refresh token
router.post("/refresh", refreshToken);

module.exports = router;
