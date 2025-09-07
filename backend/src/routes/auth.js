const express = require("express");
const router = express.Router();
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

router.post("/refresh", refreshToken);

module.exports = router;