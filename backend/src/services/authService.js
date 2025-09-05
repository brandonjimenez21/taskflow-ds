const prisma = require("./prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "supersecret"; // poner en .env en producción

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Credenciales inválidas");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Credenciales inválidas");

  // generar token
  const token = jwt.sign(
    { id: user.id, role: user.role, departmentId: user.departmentId },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return { token, user: { id: user.id, name: user.name, role: user.role } };
}

module.exports = { login };
