// Rutas (users.js, tasks.js, auth.js, etc)

const express = require("express");
const router = express.Router(); 
const prisma = require("../services/prisma");

// Crear usuario
router.post("/", async (req, res) => {
    const { name, email, password, role, departmentId } = req.body;

    try{
        const user = await prisma.user.create({
            data: { name, email, password, role, departmentId },
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: "El correo ya está en uso o datos inválidos"});
    }
});

// Listar usuarios
router.get("/", async (req, res) => {
    const users = await prisma.user.findMany({ include: { department: true } });
    res.json(users);
});

module.exports = router;
