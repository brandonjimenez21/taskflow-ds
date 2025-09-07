import React from "react";
import { Form, Button, useNavigate, Container, Card } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import './createTask.css';

const CreateTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [limitDate, setLimitDate] = useState("");
    const [tags, setTags] = useState("");
    const [error, setError] = useState("");
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!isAuthenticated) {
            setError("Debes iniciar sesión para crear una tarea");
            return;
        }
        try {
            const token = document.cookie.split('=')[1]; // Obtener el token de la cookie

            const res = await fetch("http://localhost:4000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, priority, limitDate, tags, token }),
            });
            if (!res.ok) throw new Error("Error al crear la tarea");

            navigate("/");
        } catch (err) {
            setError(err.message || "Error al crear la tarea");
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" controlId="formTask">
            <Card className="p-4 shadow create-task-card" controlId="createTaskCard">
                <h2 className="mb-4 text-center">Crear Tarea</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit} controlId="createTaskForm">
                    <Form.Group className="mb-3" controlId="formTaskTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa el título de la tarea"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTaskDescription">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Ingresa la descripción de la tarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTaskPriority">
                        <Form.Label>Prioridad</Form.Label>
                        <Form.Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            required
                        >
                            <option value="">Selecciona la prioridad</option>
                            <option value="1">Baja</option>
                            <option value="2">Media</option>
                            <option value="3">Alta</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTaskLimitDate">
                        <Form.Label>Fecha Límite</Form.Label>
                        <Form.Control
                            type="date"
                            value={limitDate}
                            onChange={(e) => setLimitDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTaskTags">
                        <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="ejemplo: urgente, cliente, backend"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" controlId="submitTaskButton">
                        Crear Tarea
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateTask;