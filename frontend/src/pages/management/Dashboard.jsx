import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Stats from "../../components/Stats";
import { Card } from "react-bootstrap"; 
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  if (user.role !== "manager") {
    return <p className="text-center mt-5">Acceso denegado. Se requiere rol de manager.</p>;
  }

  const [stats, setStats] = useState({ todo: 0, inProgress: 0, done: 0 });

  // Pedir datos al backend
  useEffect(() => {
    fetch("http://localhost:4000/api/tasks/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  // Adaptar datos para los gráficos
  const chartData = [
    { name: "Pendientes", value: stats.todo },
    { name: "En Progreso", value: stats.inProgress },
    { name: "Finalizadas", value: stats.done },
  ];

  const COLORS = ["#FFBB28", "#00C49F", "#0088FE"];

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">📊 Estadísticas de Tareas</h2>

      {/* Tarjetas */}
      <div className="d-flex justify-content-around mb-4">
        <Card className="p-3 text-center">
          <h5>Pendientes</h5>
          <h2>{stats.todo}</h2>
        </Card>
        <Card className="p-3 text-center">
          <h5>En Progreso</h5>
          <h2>{stats.inProgress}</h2>
        </Card>
        <Card className="p-3 text-center">
          <h5>Finalizadas</h5>
          <h2>{stats.done}</h2>
        </Card>
      </div>

      {/* Gráfico de pastel */}
      <h4 className="text-center mt-4">Gráfico Circular</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Gráfico de barras */}
      <h4 className="text-center mt-5">Gráfico de Barras</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
