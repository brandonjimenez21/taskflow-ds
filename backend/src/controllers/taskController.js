import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, startDate, dueDate, userId } = req.body;

    if (!title || !dueDate || !userId) {
      return res.status(400).json({ error: 'title, dueDate y userId son obligatorios' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: new Date(dueDate),
        user: { connect: { id: userId } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creando la tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};