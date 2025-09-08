import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

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
      const token = document.cookie.split("=")[1];
      const res = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, limitDate, tags, token }),
      });
      if (!res.ok) throw new Error("Error al crear la tarea");
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al crear la tarea");
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <h2 className="mb-4">Nueva Tarea</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              placeholder="Escribe un título corto y claro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe los detalles de la tarea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prioridad</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Selecciona la prioridad</option>
              <option value="1">Baja</option>
              <option value="2">Media</option>
              <option value="3">Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha Límite</label>
            <input
              type="date"
              className="form-control"
              value={limitDate}
              onChange={(e) => setLimitDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Etiquetas</label>
            <input
              type="text"
              className="form-control"
              placeholder="ejemplo: urgente, cliente, backend"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="form-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;