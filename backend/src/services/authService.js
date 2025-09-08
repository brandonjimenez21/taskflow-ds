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

async function register({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "user" // por defecto usuario normal
    }
  });

  // Opcional: devolver también tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return {
    accessToken,
    refreshToken,
    user: { id: newUser.id, name: newUser.name, role: newUser.role }
  };
}

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