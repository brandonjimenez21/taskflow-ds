const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const taskRoutes = require("../routes/tasks");

// Mockeamos el middleware de autenticación para que siempre ponga un usuario válido
jest.mock("../middlewares/authMiddleware", () => (req, res, next) => {
  req.user = { userId: 1, role: "Manager" };
  next();
});

// Mock Prisma
jest.mock("../services/prisma", () => ({
  task: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}));

const prisma = require("../services/prisma");

const app = express();
app.use(bodyParser.json());
app.use("/tasks", taskRoutes);

describe("Pruebas de creación de tareas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe devolver 400 si falta el título", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ dueDate: "2025-09-10" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "El título y la fecha límite son obligatorios"
    );
  });

  it("Debe devolver 400 si falta la fecha límite", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Mi tarea" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "El título y la fecha límite son obligatorios"
    );
  });

  it("Debe crear la tarea si los datos son correctos", async () => {
    const mockTask = {
      id: 1,
      title: "Mi tarea",
      description: "Descripción",
      status: "pendiente",
      priority: "media",
      dueDate: new Date("2025-09-10"),
      userId: 1,
    };

    prisma.task.create.mockResolvedValue(mockTask);

    const res = await request(app)
      .post("/tasks")
      .send({ title: "Mi tarea", dueDate: "2025-09-10" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body.title).toBe("Mi tarea");
  });
});

describe("Pruebas de borrado lógico de tareas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe marcar una tarea como eliminada", async () => {
    const mockTask = { id: 1, title: "Tarea", deleted: true };

    // Mockeamos la actualización de Prisma
    prisma.task.update.mockResolvedValue(mockTask);

    // Hacemos la petición DELETE
    const res = await request(app).delete("/tasks/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Tarea eliminada lógicamente"
    );
    expect(res.body.task.deleted).toBe(true);
  });

  it("No debe listar tareas eliminadas", async () => {
    // Mockeamos que solo existen tareas activas
    prisma.task.findMany.mockResolvedValue([
      { id: 1, title: "Activa", deleted: false },
    ]);

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: "Activa", deleted: false }]);
    // Verificamos que no haya tareas con deleted = true
    expect(res.body.find((t) => t.deleted === true)).toBeUndefined();
  });
});
