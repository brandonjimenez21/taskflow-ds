const prisma = require("./prisma");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "supersecreto"; // poner en .env en producción

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Credenciales inválidas");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Credenciales inválidas");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // opcional: guardar refreshToken en la DB si quieres invalidarlos
  // await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken } });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, role: user.role }
  };
}

async function register(name, email, password, role, departmentId) {

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("El correo ya está en uso");
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, departmentId },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role, departmentId: user.departmentId },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return { token, user: { id: user.id, name: user.name, role: user.role } };
}

module.exports = { login };

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    SECRET_KEY,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
}

module.exports = {
  login,
  register,
  generateAccessToken,
  generateRefreshToken
};