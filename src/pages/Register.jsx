import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", { 
        name,
        email,
        password,
      });

      if (response.data && response.data.message === "Usuário criado com sucesso") {
        navigate("/login"); 
      } else {
        setError("Erro ao registrar usuário.");
      }
    } catch (err) {
      setError("Erro ao registrar usuário.");
      console.error("Erro ao registrar usuário", err);
    }
  };

  return (
    <div className="register-container">
      <h1>Registrar</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-btn">Registrar</button>
      </form>

      <div className="login-link">
        <p>Já tem uma conta? <button onClick={() => navigate("/login")}>Faça login</button></p>
      </div>
    </div>
  );
}

export default Register;
