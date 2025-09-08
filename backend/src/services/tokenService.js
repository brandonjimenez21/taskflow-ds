const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "super secreto";

function generateToken(user, expiresIn = "1h") {
    const payload = { userId: user.userId, role: user.role || "User" };
    return jwt.sign(payload, SECRET, { expiresIn });
}


function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error("Token inválido o expirado");
    } 
}

module.exports = { generateToken, verifyToken };