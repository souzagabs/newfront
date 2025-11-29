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
        if (token) {
          const response = await api.get("/usuarios/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (err) {
        console.error("Erro ao carregar usuário!", err);
      }
    }

    carregarCursos();
    carregarUsuario();
  }, []);

  // Função para lidar com o logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);  // Limpa o estado do usuário
    navigate("/login");
  };

  return (
    <div>
      <h1>Cursos Disponíveis</h1>

      {/* Se o usuário não estiver logado, mostra os botões de Login e Cadastre-se */}
      {!user && (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/registrar")} style={{ marginLeft: "10px" }}>Cadastre-se</button>
        </div>
      )}

      {/* Se o usuário estiver logado, exibe o nome e o botão de logout */}
      {user && (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <span>{user.nome.split(" ")[0]}</span> {/* Exibe o primeiro nome */}
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
