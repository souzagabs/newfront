import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import ParticlesBackground from "../components/ParticlesBackground";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        setError("Erro ao processar o login.");
      }
    } catch (err) {
      setError("Email ou senha inválidos."); 
      console.error("Erro ao fazer login", err);
    }
  };

  return (
    <div className="login-container">
      <ParticlesBackground />
      {/* conteúdo acima do particles (z-index maior) */}
      <div className="login-inner">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
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

          <button type="submit" className="login-btn">Entrar</button>
        </form>

        <div className="register-link">
          <p>
            Ainda não tem uma conta?{" "}
            <button onClick={() => navigate("/registrar")}>Registre-se</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
