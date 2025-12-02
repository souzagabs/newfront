import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; 

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
          setUser(response.data);  // Armazena os dados do usuário logado
        }
      } catch (err) {
        console.error("Erro ao carregar usuário!", err);
      }
    }

    carregarCursos();
    carregarUsuario();
  }, []); 

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // Limpa os dados do usuário no estado
    navigate("/login");
  };

  const isUserInscrito = (cursoId) => {
    return user?.inscricoes?.some((inscricao) => inscricao.cursoId === cursoId);
  };

  const handleVerCurso = async (cursoId) => {
    console.log("Curso ID: ", cursoId);

    if (isUserInscrito(cursoId)) {
      console.log("Usuário já inscrito, redirecionando para o módulo");

      try {
        const token = localStorage.getItem("token");

        // Buscar os módulos reais do curso
        const res = await api.get(`/modulos/curso/${cursoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.length === 0) {
          console.log("Curso sem módulos. Enviando para detalhes.");
          return navigate(`/curso/${cursoId}`);
        }

        const primeiroModulo = res.data[0]; 
        navigate(`/curso/${cursoId}/modulo/${primeiroModulo.id}`);

      } catch (error) {
        console.log("Erro ao carregar módulos:", error);
        navigate(`/curso/${cursoId}`);
      }

    } else {
      console.log("Usuário não inscrito, redirecionando para os detalhes do curso");
      navigate(`/curso/${cursoId}`);
    }
  };

  return (
    <div className="home-page">
 
      <h1>Cursos Disponíveis</h1>

      {/* Se o usuário não estiver logado, mostra os botões de Login e Cadastre-se */}
      {!user && (
        <div className="nav-container">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/registrar")} style={{ marginLeft: "10px" }}>Cadastre-se</button>
        </div>
      )}

      {/* Se o usuário estiver logado, exibe o nome e o botão de logout */}
      {user && (
        <div className="nav-container">
          <span>{user.nome.split(" ")[0]}</span> {/* Exibe o primeiro nome */}
          <button onClick={logout} className="logout-btn">
  <img 
    src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
    className="logout-icon"
    alt="logout"
  />
  Sair
</button>
        </div>
      )}

      <div>
        <button onClick={() => {
          const token = localStorage.getItem("token");
          if (!token) {
            navigate("/login");  // Se não estiver logado, vai para a página de login
          } else {
            navigate("/meuscursos"); // Se estiver logado, vai para Meus Cursos
          }
        }}>
          Meus Cursos
        </button>
      </div>

      {/* Exibe os cursos */}
      <div className="cursos-container">
        {cursos.map((curso) => (
          <div key={curso.id} className="curso-card">
            <h2>{curso.nome}</h2>
            <p>{curso.descricao}</p>
            <p className="instrutor">Instrutor: {curso.instrutor?.nome}</p>
            <button onClick={() => handleVerCurso(curso.id)}>
              {isUserInscrito(curso.id) ? "Ir para o Módulo" : "Ver Curso"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
