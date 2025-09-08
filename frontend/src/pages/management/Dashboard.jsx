import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "./dashboard.css";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch("http://localhost:3000/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error cargando stats:", err));
  }, []);

  if (!stats) return <p className="loading">Cargando estadísticas...</p>;

  const tasksByStatus = stats.tasksByStatus.map((s) => ({
    name: s.status,
    value: s._count.status,
  }));

  const tasksByPriority = stats.tasksByPriority.map((p) => ({
    name: p.priority,
    value: p._count.priority,
  }));

  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <div className="dashboard-header">
        <h1>Dashboard de Manager</h1>
        <span>Resumen de tareas y métricas del departamento</span>
      </div>

      {/* Métricas rápidas */}
      <div className="metrics-grid">
        <div className="metric-box">
          <p className="metric-title">Total de Tareas</p>
          <p className="metric-value">{stats.totalTasks}</p>
        </div>
        <div className="metric-box">
          <p className="metric-title">En Proceso</p>
          <p className="metric-value">
            {tasksByStatus.find((s) => s.name === "PROCESS")?.value || 0}
          </p>
        </div>
        <div className="metric-box">
          <p className="metric-title">Completadas</p>
          <p className="metric-value">
            {tasksByStatus.find((s) => s.name === "DONE")?.value || 0}
          </p>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Tareas por Prioridad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByPriority}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Tareas por Estado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tasksByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tasksByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;