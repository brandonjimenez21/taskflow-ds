const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/auth");

// Montamos el router en una app Express solo para pruebas
const app = express();
app.use(express.json());
app.use("/", authRoutes);

// Mockeamos el servicio de login
jest.mock("../services/authService", () => ({
  login: jest.fn(),
}));

const { login } = require("../services/authService");



describe("Pruebas de login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Login válido devuelve 200 y datos de usuario", async () => {
    // Simulamos que login devuelve un objeto con token y user
    login.mockResolvedValue({
      token: "fake-jwt-token",
      user: { id: 1, email: "test@test.com" },
    });

    const res = await request(app)
      .post("/login")
      .send({ email: "test@test.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token", "fake-jwt-token");
    expect(res.body).toHaveProperty("user");
  });

  test("Login inválido devuelve 401", async () => {
    // Simulamos que login lanza un error
    login.mockRejectedValue(new Error("Credenciales inválidas"));

    const res = await request(app)
      .post("/login")
      .send({ email: "wrong@test.com", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Credenciales inválidas");
  });

  test("Si faltan email o password devuelve 400", async () => {
    const res = await request(app).post("/login").send({ email: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email y contraseña son requeridos");
  });
});
