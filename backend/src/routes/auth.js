const express = require("express");
const router = express.Router();
const prisma = require("../services/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { login } = require("../services/authService");
const { refreshToken } = require("../controllers/authController");

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
router.post('/register', async (req, res) => {
    const { name, email, password, role, departmentId } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear el usuario
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role, departmentId },
        });

        // Generar token JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

router.post("/logout", (req, res) => {
  // Aquí podrías manejar la lógica de invalidar el token si estás almacenando tokens en la base de datos
  res.status(200).json({ message: "Logout exitoso" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await WebTransportError.sendMail({
      from: '"TaskFlow" <${process.env.EMAIL_USER}>',
      to: email,
      subject: "Recuperación de contraseña",
      text: `Haz clic en el siguiente enlace para resetear tu contraseña: ${resetLink}`,
      html: `<p>Haz clic en el siguiente enlace para resetear tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
    });
    res.json({ message: "Se ha enviado un enlace de recuperación a tu email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error enviando el email de recuperación" });
  }
});

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

router.post("/refresh", refreshToken);

module.exports = router;