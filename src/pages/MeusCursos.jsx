import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function MeusCursos() {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token de autenticação não encontrado!");
          return;
        }

        console.log("Fazendo requisição para /cursos/meuscursos com token:", token);
        const response = await api.get("/cursos/meuscursos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Resposta da API - Meus Cursos:", response.data); 
        if (response.data) {
          setCursos(response.data);
        } else {
          setError("Nenhum curso encontrado.");
        }
      } catch (err) {
        console.error("Erro ao carregar cursos!", err);
        setError("Erro ao carregar cursos.");
      }
    };

    fetchCursos();
  }, []);

  const excluirCurso = async (cursoId) => {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/cursos/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCursos(cursos.filter((curso) => curso.id !== cursoId)); 
    } catch (err) {
      console.error("Erro ao excluir curso", err);
      setError("Erro ao excluir o curso.");
    }
  };

  return (
    <div>
      <h1>Meus Cursos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => navigate("/criarcurso")}>Criar Curso</button>

      {cursos.length > 0 ? (
        cursos.map((curso) => (
          <div key={curso.id}>
            <h2>{curso.nome}</h2>
            <p>{curso.descricao}</p>
            <p>Modulos: {curso.modulos.length}</p>
            <button onClick={() => navigate(`/meuscursos/${curso.id}`)}>Ver curso</button>
            <button onClick={() => excluirCurso(curso.id)}>Excluir</button>
          </div>
        ))
      ) : (
        <p>Você ainda não tem cursos criados.</p>
      )}
    </div>
  );
}

export default MeusCursos;
