import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch("http://localhost:3000/tasks/user/1", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Cambiar estado
  const updateTaskStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    await fetch("http://localhost:3000/tasks/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, status: newStatus }),
    });
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  // Editar tarea
  const editTask = async (taskId, updates) => {
    const task = tasks.find((t) => t.id === taskId);
    const updatedTask = { ...task, ...updates };

    await fetch("http://localhost:3000/tasks/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTask),
    });

    setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
  };

  // Eliminar tarea
  const deleteTask = async (taskId) => {
    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  return (
    <div className="tasks-container">
      <div className="tasks-card">
        <h2>Listado de tareas</h2>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={updateTaskStatus}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksPage;