const { generateToken, verifyToken } = require("../services/tokenService");

describe("Token Service", () => {
    test("should generate and verify a token", () => {
        const token = generateToken({ userId: 1 }, "1h");
        expect(token).toBeDefined();
    });

    test("should verify a valid token", () => {
        const payload = { userId: 1 };
        const token = generateToken(payload, "1h");
        const decoded = verifyToken(token);
        expect(decoded.userId).toBe(payload.userId);
    });

    test("should throw an error for an invalid token", () => {
        expect(() => verifyToken("invalid.token.here")).toThrow("Token inválido o expirado");
    });

    test("should throw an error for an expired token", (done) => {
        const payload = { userId: 1 };
        const token = generateToken(payload, "1s");
        setTimeout(() => {
            expect(() => verifyToken(token)).toThrow("Token inválido o expirado");
            done();
        }, 2000);
    });
});

//To run these tests, use the command: jest backend/src/tests/tokenService.test.js
