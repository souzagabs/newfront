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
    navigate("/login"); // Redireciona para a página de login
  };

  // Função para verificar se o usuário está inscrito no curso
  const isUserInscrito = (cursoId) => {
    return user?.inscricoes?.some((inscricao) => inscricao.cursoId === cursoId);
  };

  // Função para redirecionar o usuário
  const handleVerCurso = (cursoId) => {
  console.log("Curso ID: ", cursoId); // Verificando qual curso foi clicado
  if (isUserInscrito(cursoId)) {

    console.log("Usuário já inscrito, redirecionando para o módulo");
    navigate(`/curso/${cursoId}/modulo/1`);
  } else {
    
    console.log("Usuário não inscrito, redirecionando para os detalhes do curso");
    navigate(`/curso/${cursoId}`);
  }
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

      {cursos.map((curso) => (
        <div key={curso.id}>
          <h2>{curso.nome}</h2>
          <p>{curso.descricao}</p>
          <p>Instrutor: {curso.instrutor?.nome}</p>
          
          <button onClick={() => handleVerCurso(curso.id)}>
            {isUserInscrito(curso.id) ? "Ir para o Módulo" : "Ver Curso"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default HomePage;