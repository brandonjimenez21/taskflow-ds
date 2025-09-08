import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./header.css";
import logo from "../images/logo.png"; // Importamos el logo local

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name = "") => {
  return name
    .split(" ")              // divide por espacios
    .map(word => word[0])    // toma la primera letra de cada palabra
    .join("")                // las une
    .toUpperCase();          // mayúsculas
};

  return (
    <header className="header">
      {/* Logo + nombre */}
      <div className="logo-section" onClick={() => navigate("/")}>
        <img
          src={logo}
          alt="Logo"
        />
        <span className="logo-text">TaskFlow DS</span>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input type="text" placeholder="Buscar tareas..." />
      </div>

      {/* Avatar + menú */}
      <div className="user-menu">
        <button
          className="avatar-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {getInitials(user?.name || "Usuario")}
        </button>

        {menuOpen && (
          <div className="dropdown">
            {user?.role === "Manager" && (
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            )}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;