import React from "react";
import { Link } from "react-router-dom";
import "./home.css"; // opcional, para estilos separados
import logo from "../images/logo.png"; // 👈 tu logo existente

const Home = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span>TaskFlow DS</span>
        </div>
        <nav className="home-nav">
          <Link to="/">Inicio</Link>
          <Link to="/help">Ayuda</Link>
          <Link to="/login" className="btn-login">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="home-main">
        <div className="home-text">
          <h1>Lorem ipsum</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Aenean lacinia elit a arcu interdum consequat. 
            Nullam vel blandit tellus, ut convallis neque.
          </p>
          <Link to="/login" className="btn-primary">Empezar</Link>
        </div>

        <div className="home-image">
          <div className="placeholder-box"></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
