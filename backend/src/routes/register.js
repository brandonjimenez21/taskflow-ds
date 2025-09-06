const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const prisma = require('../services/prisma');

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