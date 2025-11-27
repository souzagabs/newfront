import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); // Para navegar após o login

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que o formulário seja enviado e recarregue a página

    try {
      
      const response = await api.post("/auth/login", { 
        email,     
        password,  
      });

      // Verifica se o token está na resposta
      if (response.data && response.data.token) {
        // Armazena o token no localStorage
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
      <h1>Login</h1>
      {error && <p className="error">{error}</p>} {}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;