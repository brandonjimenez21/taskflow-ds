import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("accessToken");
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4000/api/tasks/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar tareas");
        return res.json();
      })
      .then((data) => {
        // Si hay una tarea nueva en el state, agrégala al inicio del listado
        if (location.state?.newTask) {
          setTasks([location.state.newTask, ...data]);
        } else {
          setTasks(data);
        }
      })
      .catch((err) => console.error(err));
  }, [user, token, location.state]);

  // Cambiar estado
  const updateTaskStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    await fetch("http://localhost:4000/api/tasks/edit", {
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

    await fetch("http://localhost:4000/api/tasks/edit", {
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
    await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
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