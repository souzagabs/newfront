import "../styles/Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setRole("");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);

      api
        .get("/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => setUser(null));

    } catch (err) {
      console.log("Erro ao decodificar token", err);
      setUser(null);
      setRole("");
    }
  }, [location.pathname]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole("");
    navigate("/login");
  };

  const firstName = user ? user.nome?.split(" ")[0] : "";

  return (
    <header className="app-header">

      {/* LOGO */}
      <div className="header-left" onClick={() => navigate("/home")}>
        <h2 className="brand">NeonAcademy</h2>
      </div>
      
      <nav className="header-nav">
        <button onClick={() => navigate("/home")}>Home</button>

        {/* Só para usuários logados */}
        {user && (
          <button onClick={() => navigate("/meuscursos")}>Meus Cursos</button>
        )}

        {user && role === "INSTRUTOR" && (
          <button onClick={() => navigate("/criarcurso")}>Criar Curso</button>
        )}

       
        {!user && location.pathname !== "/login" && (
          <button onClick={() => navigate("/login")}>Login</button>
        )}

        {!user && (
          <button onClick={() => navigate("/registrar")}>Cadastro</button>
        )}
      </nav>

      <div className="header-right">
        {user && (
          <>
            <span className="user-name">{firstName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
