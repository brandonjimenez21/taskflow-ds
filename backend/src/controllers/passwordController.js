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

module.exports = { forgotPassword };
