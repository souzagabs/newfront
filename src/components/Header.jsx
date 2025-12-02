import React, { useNavigate } from "react";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/home")}>
        <h1>CyberLearn</h1>
      </div>
      <nav className="nav">
        <button onClick={() => navigate("/meuscursos")}>Meus Cursos</button>
        <button onClick={() => navigate("/home")}>Início</button>
        <button onClick={handleLogout}>Deslogar</button>
      </nav>
    </header>
  );
};

export default Header;
