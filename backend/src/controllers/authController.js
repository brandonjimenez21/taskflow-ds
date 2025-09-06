const jwt = require("jsonwebtoken");
const { signToken } = require("../utils/jwt");

function refreshToken(req, res) {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: "No hay refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecreto");
    const newAccessToken = signToken({ id: decoded.id, role: decoded.role });
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ error: "Refresh token inválido" });
  }
}

module.exports = { refreshToken };
