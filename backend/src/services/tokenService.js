const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "super secreto";

function generateToken(user) {
    return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error("Token inválido o expirado");
    } 
}

module.exports = { generateToken, verifyToken };