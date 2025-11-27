import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [cursos, setCursos] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    async function carregarCursos() {
      try {
        const response = await api.get("/cursos");
        setCursos(response.data);
      } catch (err) {
        console.error("Erro ao carregar cursos!", err);
      }
    }

    async function carregarUsuario() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Erro ao carregar usuário!", err);
      }
    }

    carregarCursos();
    carregarUsuario();
  }, []);

  // Função para lidar com o logout CONSERTARRR
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login"); 
  };

  return (
    <div>
      <h1>Cursos Disponíveis</h1>

      {/* Exibir nome do usuário e opção de logout CONSERTARRRR*/}
      {user && (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <span>{user.nome}</span>
          <button onClick={logout} style={{ marginLeft: "10px" }}>Deslogar</button>
        </div>
      )}

      <div>
        <button onClick={() => navigate("/meuscursos")}>Meus Cursos</button>
        
      </div>

      {cursos.map((curso) => (
        <div key={curso.id}>
          <h2>{curso.nome}</h2>
          <p>{curso.descricao}</p>
          <p>Instrutor: {curso.instrutor?.nome}</p>
          <button onClick={() => navigate(`/curso/${curso.id}`)}>Ver Curso</button>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
