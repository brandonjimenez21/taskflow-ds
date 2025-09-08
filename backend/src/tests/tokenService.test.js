const { generateToken, verifyToken } = require("../services/tokenService");

describe("Token Service", () => {
    test("should generate and verify a token", () => {
        const user = { userId: 1, role: "User" };
        const token = generateToken(user);

        const decoded = verifyToken(token);
        expect(decoded.userId).toBe(user.userId);
        expect(decoded.role).toBe(user.role);
    });

    test("should throw an error for an expired token", async () => {
        const user = { userId: 1, role: "User" };
        // Token válido solo 1 segundo
        const token = generateToken(user, "1s");

        // Esperamos 1500ms para que expire
        await new Promise((resolve) => setTimeout(resolve, 1500));

        expect(() => verifyToken(token)).toThrow("Token inválido o expirado");
    });
});
