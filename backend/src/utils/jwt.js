const jwt = require("jsonwebtoken");

const {
  JWT_SECRET = "supersecreto",
  JWT_EXPIRES_IN = "1h",
  JWT_ISSUER = "taskflow-backend",
  JWT_AUDIENCE = "taskflow-frontend",
} = process.env;

/**
 * Firma un JWT con payload mínimo y claims estándar.
 * Nunca metas datos sensibles (password, email si no es necesario, etc).
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: "HS256",
  });
}

/**
 * Verifica/decodifica un token (útil para middlewares o tests).
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithms: ["HS256"],
  });
}

module.exports = { signToken, verifyToken };