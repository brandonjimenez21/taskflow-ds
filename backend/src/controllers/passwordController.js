const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/// POST /password/forgot
async function forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email es requerido" });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
        },
        });
        
        return res.json({
            message: "Se ha enviado un enlace de recuperación (simulado).",
            token, // ⚠️ Devolver el token solo para pruebas
        });
    } catch (error) {
        console.error("Error en forgotPassword:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email es requerido" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    // Aquí deberías enviar el email con el link:
    // https://tu-frontend.com/reset-password?token=${token}
    // usando nodemailer

    return res.json({
      message: "Se ha enviado un enlace de recuperación (simulado).",
      token, // ⚠️ Solo para pruebas, no lo devuelvas en producción
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
    }
    try {
      const resetEntry = await prisma.passwordResetToken.findUnique({ where: { token } });
        if (!resetEntry || resetEntry.expiresAt < new Date()) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: resetEntry.userId },
            data: { password: hashedPassword },
        });
        await prisma.passwordResetToken.delete({ where: { token } });

        return res.json({ message: "Contraseña reseteada exitosamente" });
    }
    catch (error) {
        console.error("Error en resetPassword:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
    
module.exports = { forgotPassword, resetPassword };