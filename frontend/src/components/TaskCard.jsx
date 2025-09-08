import React, { useState } from "react";

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    onEdit(task.id, { title, description });
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>💾 Guardar</button>
          <button onClick={() => setIsEditing(false)}>❌ Cancelar</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p><b>Status:</b> {task.status}</p>

          {/* Selector de estado */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          {/* Botones de acción */}
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>✏️ Editar</button>
            <button onClick={() => onDelete(task.id)}>🗑️ Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;